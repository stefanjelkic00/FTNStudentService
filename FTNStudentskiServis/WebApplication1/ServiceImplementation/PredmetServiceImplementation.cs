using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
{
    public class PredmetServiceImplementation : IPredmetService
    {
        private readonly ApplicationDbContext _context;

        public PredmetServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Predmet> GetAllPredmets()
        {
            return _context.Predmeti
                .Include(p => p.Smerovi)
                .Include(p => p.Profesori)
                .ThenInclude(prof => prof.User)
                .ToList();
        }

        public Predmet GetPredmetById(int id)
        {
            return _context.Predmeti
                .Include(p => p.Smerovi)
                .Include(p => p.Profesori)
                .ThenInclude(prof => prof.User)
                .FirstOrDefault(p => p.Id == id);
        }

        public void AddPredmet(Predmet predmet, List<int> smerIds, List<int> profesorIds)
        {
            // Povezivanje predmeta sa smerovima
            predmet.Smerovi = _context.Smerovi
                .Where(s => smerIds.Contains(s.Id))
                .ToList();

            // Povezivanje predmeta sa profesorima
            predmet.Profesori = _context.Profesori
                .Where(prof => profesorIds.Contains(prof.Id))
                .ToList();

            _context.Predmeti.Add(predmet);
            _context.SaveChanges();
        }

        public void UpdatePredmet(int id, Predmet predmet, List<int> smerIds, List<int> profesorIds)
        {
            var existingPredmet = _context.Predmeti
                .Include(p => p.Smerovi)
                .Include(p => p.Profesori)
                .FirstOrDefault(p => p.Id == id);

            if (existingPredmet == null)
                throw new Exception($"Predmet sa ID-jem {id} ne postoji.");

            existingPredmet.Naziv = predmet.Naziv;
            existingPredmet.BrojEspb = predmet.BrojEspb;

            // Ažuriranje povezanih smerova
            existingPredmet.Smerovi.Clear();
            existingPredmet.Smerovi = _context.Smerovi
                .Where(s => smerIds.Contains(s.Id))
                .ToList();

            // Ažuriranje povezanih profesora
            existingPredmet.Profesori.Clear();
            existingPredmet.Profesori = _context.Profesori
                .Where(prof => profesorIds.Contains(prof.Id))
                .ToList();

            _context.SaveChanges();
        }

        public void DeletePredmet(int id)
        {
            var predmet = _context.Predmeti.Find(id);
            if (predmet == null)
                return;

            _context.Predmeti.Remove(predmet);
            _context.SaveChanges();
        }
    }
}
