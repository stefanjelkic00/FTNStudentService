using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfesorController : ControllerBase
    {
        private readonly IProfesorService _profesorService;

        public ProfesorController(IProfesorService profesorService)
        {
            _profesorService = profesorService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProfesorReadAndUpdateDTO>> GetAllProfesors()
        {
            var profesori = _profesorService.GetAllProfesors();

            if (!profesori.Any())
                return NotFound("Nema dostupnih profesora.");

            var rezultat = profesori.Select(p => new ProfesorReadAndUpdateDTO
            {
                Id = p.Id,
                Ime = p.User?.Ime ?? "Nepoznato",
                Prezime = p.User?.Prezime ?? "Nepoznato",
                Zvanje = p.Zvanje,
                KatedraNaziv = p.Katedra?.Naziv,
                KatedraId = p.KatedraId
            }).ToList();

            return Ok(rezultat);
        }

        [HttpGet("{id}")]
        public ActionResult<ProfesorReadAndUpdateDTO> GetProfesorById(int id)
        {
            var profesor = _profesorService.GetProfesorById(id);
            if (profesor == null)
                return NotFound($"Profesor sa ID-jem {id} ne postoji.");

            var rezultat = new ProfesorReadAndUpdateDTO
            {
                Id = profesor.Id,
                Ime = profesor.User?.Ime ?? "Nepoznato",
                Prezime = profesor.User?.Prezime ?? "Nepoznato",
                Zvanje = profesor.Zvanje,
                KatedraNaziv = profesor.Katedra?.Naziv,
                KatedraId = profesor.KatedraId
            };

            return Ok(rezultat);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateProfesor(int id, [FromBody] ProfesorReadAndUpdateDTO profesorDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingProfesor = _profesorService.GetProfesorById(id);
            if (existingProfesor == null)
                return NotFound($"Profesor sa ID-jem {id} ne postoji.");

            // ✅ Ažuriranje samo bitnih podataka
            existingProfesor.Zvanje = profesorDto.Zvanje;
            existingProfesor.KatedraId = profesorDto.KatedraId;

            _profesorService.UpdateProfesor(id, profesorDto);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProfesor(int id)
        {
            if (!_profesorService.GetAllProfesors().Any(p => p.Id == id))
                return NotFound($"Profesor sa ID-jem {id} ne postoji.");

            _profesorService.DeleteProfesor(id);
            return NoContent();
        }

        [Authorize(Roles = "Profesor")]
        [HttpGet("predmeti-sa-prijavama")]
        public IActionResult GetPredmetiProfesora()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Korisnički ID nije pronađen. Molimo pokušajte ponovo.");
            }

            if (!int.TryParse(userIdClaim, out int profesorId))
            {
                return BadRequest("Nevažeći ID korisnika.");
            }

            var rezultat = _profesorService.DohvatiPredmeteSaStudentima(profesorId);
            return rezultat != null ? Ok(rezultat) : NotFound("Profesor nema dodeljene predmete.");
        }

        [Authorize(Roles = "Profesor")]
        [HttpPost("oceni-studenta")]
        public async Task<IActionResult> OceniStudenta([FromBody] OcenaDTO ocenaDto)
        {
            if (ocenaDto == null || ocenaDto.Ocena < 5 || ocenaDto.Ocena > 10)
                return BadRequest("Nevažeći podaci za ocenjivanje.");

            var rezultat = await _profesorService.OceniStudenta(ocenaDto.StudentId, ocenaDto.PredmetId, ocenaDto.Ocena);
            return rezultat ? Ok("Ocena uspešno uneta.") : BadRequest("Neuspešno ocenjivanje studenta.");
        }


        [Authorize(Roles = "Profesor")]
        [HttpGet("ocenjeni-studenti")]
        public IActionResult GetOcenjeniStudenti()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Korisnički ID nije pronađen.");
            }

            if (!int.TryParse(userIdClaim, out int profesorId))
            {
                return BadRequest("Nevažeći ID korisnika.");
            }

            var rezultat = _profesorService.DohvatiOcenjeneStudente(profesorId);
            return rezultat != null ? Ok(rezultat) : NotFound("Nema ocenjenih studenata.");
        }

        // 🔹 Prikaz predmeta na koje profesor može da aplicira
        [HttpGet("predmeti-za-apliciranje")]
        [Authorize(Roles = "Profesor")]
        public IActionResult GetPredmetiZaApliciranje()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int profesorId))
                return BadRequest("Nevažeći ID korisnika.");

            var predmeti = _profesorService.DohvatiPredmeteZaApliciranje(profesorId);
            return Ok(predmeti);
        }

        // 🔹 Slanje zahteva za predmet
        [HttpPost("apliciraj")]
        [Authorize(Roles = "Profesor")]
        public IActionResult AplicirajZaPredmet([FromBody] int predmetId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int profesorId))
                return BadRequest("Nevažeći ID korisnika.");

            var uspeh = _profesorService.AplicirajZaPredmet(profesorId, predmetId);
            return uspeh ? Ok("Zahtev uspešno poslat.") : BadRequest("Već ste podneli zahtev za ovaj predmet.");
        }

        // 🔹 Otkazivanje zahteva za predmet
        [HttpDelete("otkazi-zahtev/{predmetId}")]
        [Authorize(Roles = "Profesor")]
        public IActionResult OtkaziZahtev(int predmetId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int profesorId))
                return BadRequest("Nevažeći ID korisnika.");

            var uspeh = _profesorService.OtkaziZahtev(profesorId, predmetId);
            return uspeh ? Ok("Zahtev uspešno otkazan.") : BadRequest("Zahtev nije pronađen.");
        }

        [HttpGet("moji-zahtevi")]
        [Authorize(Roles = "Profesor")]
        public IActionResult DohvatiMojeZahteve()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int profesorId))
                return BadRequest("Nevažeći ID korisnika.");

            var zahtevi = _profesorService.DohvatiMojeZahteve(profesorId);
            return Ok(zahtevi);
        }



    }
}
