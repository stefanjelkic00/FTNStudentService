using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
{
    public class StudentiPredmetiService : IStudentiPredmetiService
    {
        private readonly ApplicationDbContext _context;

        public StudentiPredmetiService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 Predmeti koje student može da prijavi
        public IEnumerable<Predmet> GetPredmetiZaPrijavu(int studentId)
        {
            var student = _context.Studenti.Include(s => s.Smer).FirstOrDefault(s => s.Id == studentId);
            if (student == null) return new List<Predmet>();

            return _context.Predmeti
                .Where(p => p.Smerovi.Any(s => s.Id == student.SmerId) &&
                            !_context.StudentiPredmeti.Any(sp => sp.StudentId == studentId && sp.PredmetId == p.Id))
                .ToList();
        }

        // 🔹 Položeni predmeti
        public IEnumerable<StudentiPredmeti> GetPolozeniPredmeti(int studentId)
        {
            return _context.StudentiPredmeti
                .Include(sp => sp.Predmet)
                .Where(sp => sp.StudentId == studentId && sp.Ocena.HasValue)
                .ToList();
        }

        // 🔹 Svi predmeti na smeru studenta
        public IEnumerable<Predmet> GetSviPredmetiNaSmeru(int studentId)
        {
            var student = _context.Studenti.Include(s => s.Smer).FirstOrDefault(s => s.Id == studentId);
            if (student == null) return new List<Predmet>();

            return _context.Predmeti
                .Where(p => p.Smerovi.Any(s => s.Id == student.SmerId))
                .ToList();
        }

        // 🔹 Dohvati naziv smera studenta
        public string GetSmerStudenta(int studentId)
        {
            var student = _context.Studenti
                .Include(s => s.Smer)
                .FirstOrDefault(s => s.Id == studentId);

            return student?.Smer?.Naziv;
        }

        public void UnesiOcenu(int studentId, int predmetId, int ocena)
        {
            var prijava = _context.PrijaveStudenta
                .FirstOrDefault(p => p.StudentId == studentId && p.PredmetId == predmetId);

            if (prijava == null)
                throw new System.Exception("Prijava nije pronađena.");

            // ➡️ Ocenu unosimo u StudentiPredmeti
            var studentPredmet = new StudentiPredmeti
            {
                StudentId = studentId,
                PredmetId = predmetId,
                Ocena = ocena
            };
            _context.StudentiPredmeti.Add(studentPredmet);

            // ➡️ Brišemo prijavu nakon unosa ocene
            _context.PrijaveStudenta.Remove(prijava);
            _context.SaveChanges();
        }

        // 🔹 Izračunaj prosek studenta
        public double IzracunajProsekStudenta(int studentId)
        {
            var ocene = _context.StudentiPredmeti
                .Where(sp => sp.StudentId == studentId && sp.Ocena.HasValue)
                .Select(sp => sp.Ocena.Value)
                .ToList();

            return ocene.Any() ? ocene.Average() : 0.0;
        }
    }
}
