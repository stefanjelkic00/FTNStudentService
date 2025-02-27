using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SmerController : ControllerBase
    {
        private readonly ISmerService _smerService;

        public SmerController(ISmerService smerService)
        {
            _smerService = smerService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAllSmerovi()
        {
            var smerovi = _smerService.GetAllSmerovi();
            if (!smerovi.Any())
                return NotFound("Nema dostupnih smerova.");

            var result = smerovi.Select(s => new
            {
                s.Id,
                s.Naziv,
                Katedre = s.Katedre.Select(k => k.Naziv).ToList(),
                Predmeti = s.Predmeti.Select(p => p.Naziv).ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public ActionResult<object> GetSmerById(int id)
        {
            var smer = _smerService.GetSmerById(id);
            if (smer == null)
                return NotFound($"Smer sa ID-jem {id} ne postoji.");

            var result = new
            {
                smer.Id,
                smer.Naziv,
                Katedre = smer.Katedre.Select(k => k.Naziv).ToList(),
                Predmeti = smer.Predmeti.Select(p => new
                {
                    Id = p.Id,
                    Naziv = p.Naziv,
                    Profesori = p.Profesori.Select(prof => new
                    {
                        Ime = prof.User.Ime,
                        Prezime = prof.User.Prezime
                    }).ToList()
                }).ToList()
            };

            return Ok(result);
        }

        [HttpPost]
        public ActionResult CreateSmer([FromBody] SmerCreateDTO smerDto)
        {
            if (string.IsNullOrWhiteSpace(smerDto.Naziv))
                return BadRequest("Naziv ne može biti prazan.");

            var smer = new Smer { Naziv = smerDto.Naziv };
            _smerService.AddSmer(smer);

            return CreatedAtAction(nameof(GetSmerById), new { id = smer.Id }, smer);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSmer(int id, [FromBody] SmerCreateDTO smerDto)
        {
            if (string.IsNullOrWhiteSpace(smerDto.Naziv))
                return BadRequest("Naziv ne može biti prazan.");

            try
            {
                _smerService.UpdateSmer(id, smerDto.Naziv);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/dodaj-predmete")]
        public IActionResult DodajPredmeteUSmer(int id, [FromBody] PredmetIdsDTO predmetIdsDto)
        {
            if (predmetIdsDto == null || predmetIdsDto.PredmetIds == null || !predmetIdsDto.PredmetIds.Any())
                return BadRequest("Lista predmeta ne može biti prazna.");

            try
            {
                _smerService.DodajPredmeteUSmer(id, predmetIdsDto.PredmetIds);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSmer(int id)
        {
            try
            {
                _smerService.DeleteSmer(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}