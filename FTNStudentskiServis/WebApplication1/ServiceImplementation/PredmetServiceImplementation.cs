using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServicesImplementation
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

        public void AddPredmet(Predmet predmet)
        {
            _context.Predmeti.Add(predmet);
            _context.SaveChanges();
        }


        public void UpdatePredmet(int id, string naziv, int brojEspb)
        {
            var existingPredmet = _context.Predmeti.Find(id);
            if (existingPredmet == null) throw new System.Exception("Predmet not found");

            existingPredmet.Naziv = naziv;
            existingPredmet.BrojEspb = brojEspb;

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
