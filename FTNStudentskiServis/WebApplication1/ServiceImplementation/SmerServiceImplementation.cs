using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
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
                .ThenInclude(prof => prof.User) // Učitaj povezani User za profesora
                .ToList();
        }

        public Smer GetSmerById(int id)
        {
            return _context.Smerovi
                .Include(s => s.Katedre)
                .Include(s => s.Predmeti)
                .ThenInclude(p => p.Profesori)
                .ThenInclude(prof => prof.User) // Učitaj povezani User za profesora
                .FirstOrDefault(s => s.Id == id);
        }

        public void AddSmer(Smer smer, List<int> katedraIds, List<int> predmetIds)
        {
            var katedre = _context.Katedre.Where(k => katedraIds.Contains(k.Id)).ToList();
            var predmeti = _context.Predmeti.Where(p => predmetIds.Contains(p.Id)).ToList();

            smer.Katedre = katedre;
            smer.Predmeti = predmeti;

            _context.Smerovi.Add(smer);
            _context.SaveChanges();
        }

        public void UpdateSmer(int id, Smer smer, List<int> katedraIds, List<int> predmetIds)
        {
            var existingSmer = _context.Smerovi
                .Include(s => s.Katedre)
                .Include(s => s.Predmeti)
                .FirstOrDefault(s => s.Id == id);
            if (existingSmer == null) throw new System.Exception("Smer not found");

            existingSmer.Naziv = smer.Naziv;
            existingSmer.Katedre = _context.Katedre.Where(k => katedraIds.Contains(k.Id)).ToList();
            existingSmer.Predmeti = _context.Predmeti.Where(p => predmetIds.Contains(p.Id)).ToList();

            _context.SaveChanges();
        }

        public void DeleteSmer(int id)
        {
            var smer = _context.Smerovi.FirstOrDefault(s => s.Id == id);
            if (smer == null) throw new System.Exception("Smer not found");

            _context.Smerovi.Remove(smer);
            _context.SaveChanges();
        }
    }
}
