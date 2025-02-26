using Microsoft.EntityFrameworkCore;
using WebAPLIKACIJAVEZBANJE.Enums;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;


namespace WebApplication1.ServiceImplementation
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
            var student = await _context.Studenti
                .Include(s => s.Smer)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null || student.SmerId == null)
                return new List<Predmet>();

            return await _context.PrijaveStudenta
                .Where(p => p.StudentId == studentId && p.StatusIspita == StatusIspita.Nepolozen)
                .Select(p => p.Predmet)
                .Where(p => p.Smerovi.Any(s => s.Id == student.SmerId))
                .ToListAsync();
        }

        public async Task<List<Predmet>> GetPolozeniPredmeti(int studentId)
        {
            var student = await _context.Studenti
                .Include(s => s.Smer)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null || student.SmerId == null)
                return new List<Predmet>();

            return await _context.PrijaveStudenta
                .Where(p => p.StudentId == studentId && p.StatusIspita == StatusIspita.Polozen)
                .Select(p => p.Predmet)
                .Where(p => p.Smerovi.Any(s => s.Id == student.SmerId))
                .ToListAsync();
        }

        public async Task<(bool Success, string Message)> PrijaviIspit(int studentId, int predmetId)
        {
            Console.WriteLine($"🔹 POKUŠAJ PRIJAVE: Student ID = {studentId}, Predmet ID = {predmetId}");

            var student = await _context.Studenti
                .Include(s => s.Smer)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null || student.SmerId == null)
            {
                Console.WriteLine("❌ GREŠKA: Student ne postoji ili nema dodeljen smer.");
                return (false, "Nemate dodeljen smer. Kontaktirajte administratora.");
            }

            var predmet = await _context.Predmeti
                .Include(p => p.Smerovi)
                .FirstOrDefaultAsync(p => p.Id == predmetId);

            if (predmet == null)
            {
                Console.WriteLine("❌ GREŠKA: Predmet ne postoji.");
                return (false, "Predmet ne postoji.");
            }

            if (!predmet.Smerovi.Any(s => s.Id == student.SmerId))
            {
                Console.WriteLine("❌ GREŠKA: Predmet nije povezan sa smerom studenta.");
                return (false, "Ne možete prijaviti ispit za predmet koji nije deo vašeg smera.");
            }

            var prijavaPostoji = await _context.PrijaveStudenta
                .AnyAsync(p => p.StudentId == student.Id && p.PredmetId == predmetId);

            if (prijavaPostoji)
            {
                Console.WriteLine("❌ GREŠKA: Student je već prijavio ovaj ispit.");
                return (false, "Već ste prijavili ovaj ispit.");
            }

            var prijava = new PrijavaStudenta
            {
                StudentId = student.Id,
                PredmetId = predmetId,
                StatusIspita = StatusIspita.Nepolozen
            };

            _context.PrijaveStudenta.Add(prijava);
            await _context.SaveChangesAsync();

            Console.WriteLine("✅ USPEŠNA PRIJAVA ISPITA!");
            return (true, "Ispit uspešno prijavljen!");
        }


        public void UnesiOcenu(int studentId, int predmetId, int ocena)
        {
            var prijava = _context.PrijaveStudenta
                .FirstOrDefault(p => p.StudentId == studentId && p.PredmetId == predmetId);

            if (prijava == null)
                throw new System.Exception("Prijava nije pronađena.");

            prijava.Ocena = ocena;
            prijava.StatusIspita = ocena >= 6 ? StatusIspita.Polozen : StatusIspita.Nepolozen;

            _context.SaveChanges();
        }

        public double IzracunajProsekStudenta(int studentId)
        {
            var ocene = _context.PrijaveStudenta
                .Where(p => p.StudentId == studentId && p.StatusIspita == StatusIspita.Polozen)
                .Select(p => p.Ocena)
                .Where(o => o.HasValue)
                .Select(o => o.Value)
                .ToList();

            return ocene.Any() ? ocene.Average() : 0.0;
        }
    }
}
