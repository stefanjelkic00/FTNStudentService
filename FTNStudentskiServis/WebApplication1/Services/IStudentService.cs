using System.Collections.Generic;
using WebApplication1.DTO;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IStudentService
    {
        IEnumerable<Student> GetAllStudents();
        Student GetStudentById(int id);
        bool UpdateStudent(int id, StudentReadAndUpdateDTO studentDto);
        bool DeleteStudent(int id);
    }
}
