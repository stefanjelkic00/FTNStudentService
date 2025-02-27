using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServicesImplementation
{
    public class StudentServiceImplementation : IStudentService
    {
        private readonly ApplicationDbContext _context;

        public StudentServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Student> GetAllStudents()
        {
            return _context.Studenti
                .Include(s => s.Smer)
                .Include(s => s.User) // ✅ Uključujemo povezani User entitet
                .ToList();
        }

        public Student GetStudentById(int id)
        {
            return _context.Studenti
                .Include(s => s.Smer)
                .Include(s => s.User) // ✅ Uključujemo povezani User entitet
                .FirstOrDefault(s => s.Id == id);
        }


        public bool UpdateStudent(int id, StudentReadAndUpdateDTO studentDto)
        {
            var existingStudent = _context.Studenti
                .Include(s => s.User) // ✅ Učitaj povezani User entitet
                .FirstOrDefault(s => s.Id == id);

            if (existingStudent == null) return false;

            // ✅ Ažuriranje podataka u Student entitetu
            existingStudent.Index = studentDto.Index;
            existingStudent.GodinaUpisa = studentDto.GodinaUpisa;
            existingStudent.SmerId = studentDto.SmerId;

            // ✅ Ažuriranje podataka u User entitetu ako postoji
            if (existingStudent.User != null)
            {
                existingStudent.User.Ime = studentDto.Ime;
                existingStudent.User.Prezime = studentDto.Prezime;
            }

            _context.SaveChanges(); // ✅ Snimanje svih promena u bazi

            return true;
        }


        public bool DeleteStudent(int id)
        {
            var student = _context.Studenti
                .Include(s => s.User) // Učitavamo povezanog korisnika
                .FirstOrDefault(s => s.Id == id);

            if (student == null) return false;

            // 🔹 Brisanje svih prijava studenta
            var prijaveStudenta = _context.PrijaveStudenta
                .Where(p => p.StudentId == id)
                .ToList();

            if (prijaveStudenta.Any())
            {
                _context.PrijaveStudenta.RemoveRange(prijaveStudenta);
            }

            // 🔹 Brisanje svih ocena studenta iz StudentiPredmeti tabele
            var studentiPredmeti = _context.StudentiPredmeti
                .Where(sp => sp.StudentId == id)
                .ToList();

            if (studentiPredmeti.Any())
            {
                _context.StudentiPredmeti.RemoveRange(studentiPredmeti);
            }

            // 🔹 Brišemo studenta
            _context.Studenti.Remove(student);

            // 🔹 Brišemo korisnika ako postoji
            if (student.User != null)
            {
                _context.Users.Remove(student.User);
            }

            _context.SaveChanges();
            return true;
        }



    }
}
