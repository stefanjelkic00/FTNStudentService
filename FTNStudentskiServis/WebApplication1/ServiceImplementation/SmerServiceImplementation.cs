using Microsoft.EntityFrameworkCore; // Dodato za Include i ThenInclude
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServicesImplementation
{
    public class SmerServiceImplementation : ISmerService
    {
        private readonly ApplicationDbContext _context;

        public SmerServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Smer> GetAllSmerovi()
        {
            return _context.Smerovi
              .Include(s => s.Katedre)
              .Include(s => s.Predmeti)
              .ThenInclude(p => p.Profesori)
              .ThenInclude(prof => prof.User)
              .ToList();
        }

        public Smer GetSmerById(int id)
        {
            return _context.Smerovi
              .Include(s => s.Katedre)
              .Include(s => s.Predmeti)
              .ThenInclude(p => p.Profesori)
              .ThenInclude(prof => prof.User)
              .FirstOrDefault(s => s.Id == id);
        }

        public void AddSmer(Smer smer)
        {
            _context.Smerovi.Add(smer);
            _context.SaveChanges();
        }

        public void UpdateSmer(int id, string naziv)
        {
            var existingSmer = _context.Smerovi.Find(id);
            if (existingSmer == null) throw new Exception("Smer not found");

            existingSmer.Naziv = naziv;
            _context.SaveChanges();
        }

        public void DodajPredmeteUSmer(int smerId, List<int> predmetIds)
        {
            var smer = _context.Smerovi
              .Include(s => s.Predmeti)
              .FirstOrDefault(s => s.Id == smerId);

            if (smer == null)
                throw new Exception("Smer nije pronađen.");

            var predmetiZaDodavanje = _context.Predmeti
              .Where(p => predmetIds.Contains(p.Id))
              .ToList();

            if (!predmetiZaDodavanje.Any())
                throw new Exception("Nema validnih predmeta za dodavanje.");

            foreach (var predmet in predmetiZaDodavanje)
            {
                if (!smer.Predmeti.Contains(predmet))
                    smer.Predmeti.Add(predmet);
            }

            _context.SaveChanges();
        }

        public void DeleteSmer(int id)
        {
            var smer = _context.Smerovi.FirstOrDefault(s => s.Id == id);
            if (smer == null) throw new Exception("Smer not found");

            _context.Smerovi.Remove(smer);
            _context.SaveChanges();
        }
    }
}