using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApplication1.DTO;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrijavaStudentaController : ControllerBase
    {
        private readonly IPrijavaStudentaService _prijavaStudentaService;

        public PrijavaStudentaController(IPrijavaStudentaService prijavaStudentaService)
        {
            _prijavaStudentaService = prijavaStudentaService;
        }

        // ✅ PRIJAVA ISPITA - sada API prepoznaje studenta iz tokena!
        [Authorize(Roles = "Student")]
        [HttpPost("prijava-ispita")]
        public async Task<IActionResult> PrijaviIspit([FromBody] PrijavaStudentaCreateDTO prijavaDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int studentId))
                return Unauthorized("Niste prijavljeni.");

            var success = await _prijavaStudentaService.PrijaviIspit(studentId, prijavaDto.PredmetId);

            if (!success)
                return BadRequest("Neuspešna prijava ispita. Možda ste već prijavili ovaj ispit.");

            return Ok(new { message = "Ispit uspešno prijavljen!" });
        }


        // ✅ PRIJAVLJENI PREDMETI
        [Authorize(Roles = "Student")]
        [HttpGet("prijavljeni-predmeti")]
        public async Task<IActionResult> GetPrijavljeniPredmeti()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int studentId))
                return Unauthorized("Niste prijavljeni.");

            var prijavljeniPredmeti = await _prijavaStudentaService.GetPrijavljeniPredmeti(studentId);
            return Ok(prijavljeniPredmeti);
        }

      

        [Authorize(Roles = "Student")]
        [HttpGet("predmeti-za-prijavu")]
        public async Task<IActionResult> GetPredmetiZaPrijavu()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int studentId))
                return Unauthorized("Niste prijavljeni.");

            var predmeti = await _prijavaStudentaService.GetPredmetiZaPrijavu(studentId);

            return Ok(predmeti.Select(p => new { p.Id, p.Naziv }));
        }


     
    }
}
