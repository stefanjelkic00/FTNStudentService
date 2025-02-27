using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServicesImplementation
{
    public class PrijavaStudentaServiceImplementation : IPrijavaStudentaService
    {
        private readonly ApplicationDbContext _context;

        public PrijavaStudentaServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Predmet>> GetPrijavljeniPredmeti(int studentId)
        {
            return await _context.PrijaveStudenta
                .Where(p => p.StudentId == studentId && p.StatusIspita == false) // ✅ Sada koristi bool
                .Select(p => p.Predmet)
                .ToListAsync();
        }


        public async Task<List<Predmet>> GetPredmetiZaPrijavu(int studentId)
        {
            var student = await _context.Studenti
                .Include(s => s.PrijavaStudenta)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null || student.SmerId == null)
                return new List<Predmet>();

            // Svi predmeti na smeru studenta
            var sviPredmetiNaSmeru = await _context.Predmeti
                .Where(p => p.Smerovi.Any(s => s.Id == student.SmerId))
                .ToListAsync();

            // Predmeti koje je student već prijavio
            var prijavljeniPredmetiIds = student.PrijavaStudenta
                .Select(p => p.PredmetId)
                .ToList();

            // Predmeti koje je student položio (nalaze se u `StudentiPredmeti`)
            var polozeniPredmetiIds = await _context.StudentiPredmeti
                .Where(sp => sp.StudentId == studentId)
                .Select(sp => sp.PredmetId)
                .ToListAsync();

            // Filtriramo predmete koji nisu ni prijavljeni ni položeni
            var predmetiZaPrijavu = sviPredmetiNaSmeru
                .Where(p => !prijavljeniPredmetiIds.Contains(p.Id) && !polozeniPredmetiIds.Contains(p.Id))
                .ToList();

            return predmetiZaPrijavu;
        }


        public async Task<bool> PrijaviIspit(int studentId, int predmetId)
        {
            var student = await _context.Studenti.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null || student.SmerId == null)
                return false;

            var predmet = await _context.Predmeti.FirstOrDefaultAsync(p => p.Id == predmetId);
            if (predmet == null)
                return false;

            var postojiPrijava = await _context.PrijaveStudenta
                .AnyAsync(p => p.StudentId == studentId && p.PredmetId == predmetId);

            if (postojiPrijava)
                return false;

            var novaPrijava = new PrijavaStudenta
            {
                StudentId = studentId,
                PredmetId = predmetId,
                StatusIspita = false
            };

            _context.PrijaveStudenta.Add(novaPrijava);
            await _context.SaveChangesAsync();
            return true;
        }

 
    }
}
