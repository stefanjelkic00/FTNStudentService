using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTO;


namespace WebApplication1.ServicesImplementation
{
    public class KatedraServiceImplementation : IKatedraService
    {
        private readonly ApplicationDbContext _context;

        public KatedraServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<KatedraReadAndUpdateDTO> GetAllKatedras()
        {
            var katedre = _context.Katedre
                .Include(k => k.Smerovi)
                .AsNoTracking()
                .ToList();

            return katedre.Select(k => new KatedraReadAndUpdateDTO
            {
                Id = k.Id,
                Naziv = k.Naziv,
                Smerovi = k.Smerovi.Select(s => s.Naziv).ToList() // 👈 Ovdje vraćamo samo nazive smerova
            });
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

        public void UpdateKatedra(int id, string naziv)
        {
            var existingKatedra = _context.Katedre.Find(id);
            if (existingKatedra == null) throw new System.Exception("Katedra not found");

            existingKatedra.Naziv = naziv;

            _context.SaveChanges();
        }
        public void DodajSmeroveUKatedru(int katedraId, List<int> smerIds)
        {
            var katedra = _context.Katedre
                .Include(k => k.Smerovi)
                .FirstOrDefault(k => k.Id == katedraId);

            if (katedra == null)
                throw new Exception("Katedra nije pronađena.");

            var smeroviZaDodavanje = _context.Smerovi
                .Where(s => smerIds.ToList().Contains(s.Id)) // ✅ Osiguravamo da je kolekcija
                .ToList();

            if (!smeroviZaDodavanje.Any())
                throw new Exception("Nema validnih smerova za dodavanje.");

            foreach (var smer in smeroviZaDodavanje)
            {
                if (!katedra.Smerovi.Contains(smer))
                    katedra.Smerovi.Add(smer);
            }

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
