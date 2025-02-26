using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
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
            return _context.Studenti.Include(s => s.Smer).ToList();
        }

        public Student GetStudentById(int id)
        {
            return _context.Studenti.Include(s => s.Smer).FirstOrDefault(s => s.Id == id);
        }

        public bool UpdateStudent(int id, StudentReadAndUpdateDTO studentDto)
        {
            var existingStudent = _context.Studenti.Find(id);
            if (existingStudent == null) return false;

            existingStudent.Index = studentDto.Index;
            existingStudent.GodinaUpisa = studentDto.GodinaUpisa;
            existingStudent.SmerId = studentDto.SmerId;

            _context.SaveChanges();
            return true;
        }

        public bool DeleteStudent(int id)
        {
            var student = _context.Studenti.Find(id);
            if (student == null) return false;

            _context.Studenti.Remove(student);
            _context.SaveChanges();
            return true;
        }
    }
}
