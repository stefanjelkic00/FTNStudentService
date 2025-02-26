using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
{
    public class KatedraServiceImplementation : IKatedraService
    {
        private readonly ApplicationDbContext _context;

        public KatedraServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Katedra> GetAllKatedras()
        {
            return _context.Katedre.ToList();
        }

        public Katedra GetKatedraById(int id)
        {
            return _context.Katedre
                .Include(k => k.Smerovi) // <- ERROR: 'Include' not recognized
                .FirstOrDefault(k => k.Id == id);
        }



        public void AddKatedra(Katedra katedra)
        {
            _context.Katedre.Add(katedra);
            _context.SaveChanges();
        }

        public void UpdateKatedra(int id, Katedra katedra)
        {
            var existingKatedra = _context.Katedre.Find(id);
            if (existingKatedra == null) return;

            existingKatedra.Naziv = katedra.Naziv;

            _context.SaveChanges();
        }

        public void DeleteKatedra(int id)
        {
            var katedra = _context.Katedre.Find(id);
            if (katedra == null) return;

            _context.Katedre.Remove(katedra);
            _context.SaveChanges();
        }
    }
}
