using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.DTO;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<StudentReadAndUpdateDTO>> GetAllStudents()
        {
            var studenti = _studentService.GetAllStudents();
            if (!studenti.Any())
                return NotFound("Nema dostupnih studenata.");

            return Ok(studenti.Select(s => new StudentReadAndUpdateDTO
            {
                Id = s.Id,  // ✅ DODATO!
                Index = s.Index,
                GodinaUpisa = s.GodinaUpisa,
                SmerId = s.SmerId,
                Ime = s.User?.Ime,
                Prezime = s.User?.Prezime
            }).ToList());
        }


        [HttpGet("{id}")]
        public ActionResult<StudentReadAndUpdateDTO> GetStudentById(int id)
        {
            var student = _studentService.GetStudentById(id);
            if (student == null)
                return NotFound($"Student sa ID-jem {id} ne postoji.");

            return Ok(new StudentReadAndUpdateDTO
            {
                Index = student.Index,
                GodinaUpisa = student.GodinaUpisa,
                SmerId = student.SmerId,
                Ime = student.User?.Ime, // ✅ Dodato ime iz User entiteta
                Prezime = student.User?.Prezime // ✅ Dodato prezime iz User entiteta
            });
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateStudent(int id, [FromBody] StudentReadAndUpdateDTO studentDto)
        {
            if (_studentService.UpdateStudent(id, studentDto))
                return Ok(new { message = "Student uspešno ažuriran!" });

            return NotFound($"Student sa ID-jem {id} ne postoji.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(int id)
        {
            if (_studentService.DeleteStudent(id))
                return Ok(new { message = "Student uspešno obrisan!" });

            return NotFound($"Student sa ID-jem {id} ne postoji.");
        }
    }
}
