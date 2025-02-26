using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
{
    public class ProfesorServiceImplementation : IProfesorService
    {
        private readonly ApplicationDbContext _context;

        public ProfesorServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Profesor> GetAllProfesors()
        {
            return _context.Profesori
                .Include(p => p.User)  // ✅ Dodato da bi se povukli podaci o korisniku (Ime, Prezime)
                .Include(p => p.Katedra)
                .ToList();
        }

        public Profesor GetProfesorById(int id)
        {
            return _context.Profesori
                .Include(p => p.User)  // ✅ Dodato da bi se povukli podaci o korisniku
                .Include(p => p.Katedra)
                .FirstOrDefault(p => p.Id == id);
        }

        public void AddProfesor(Profesor profesor)
        {
            _context.Profesori.Add(profesor);
            _context.SaveChanges();
        }

        public void UpdateProfesor(int id, Profesor profesor)
        {
            var existingProfesor = _context.Profesori.Find(id);
            if (existingProfesor == null) return;

            existingProfesor.Zvanje = profesor.Zvanje;
            existingProfesor.KatedraId = profesor.KatedraId;

            _context.SaveChanges();
        }

        public void DeleteProfesor(int id)
        {
            var profesor = _context.Profesori.Find(id);
            if (profesor == null) return;

            _context.Profesori.Remove(profesor);
            _context.SaveChanges();
        }
    }
}
