using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredmetController : ControllerBase
    {
        private readonly IPredmetService _predmetService;

        public PredmetController(IPredmetService predmetService)
        {
            _predmetService = predmetService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PredmetReadAndUpdateDTO>> GetAllPredmets()
        {
            var predmeti = _predmetService.GetAllPredmets();
            if (!predmeti.Any())
                return NotFound("Nema dostupnih predmeta.");

            return Ok(predmeti.Select(p => new PredmetReadAndUpdateDTO
            {
                Id = p.Id,
                Naziv = p.Naziv,
                BrojEspb = p.BrojEspb,
                SmerIds = p.Smerovi.Select(s => s.Id).ToList(),
                ProfesorIds = p.Profesori.Select(prof => prof.Id).ToList()
            }));
        }

        [HttpGet("{id}")]
        public ActionResult<PredmetReadAndUpdateDTO> GetPredmetById(int id)
        {
            var predmet = _predmetService.GetPredmetById(id);
            if (predmet == null)
                return NotFound($"Predmet sa ID-jem {id} ne postoji.");

            return Ok(new PredmetReadAndUpdateDTO
            {
                Id = predmet.Id,
                Naziv = predmet.Naziv,
                BrojEspb = predmet.BrojEspb,
                SmerIds = predmet.Smerovi.Select(s => s.Id).ToList(),
                ProfesorIds = predmet.Profesori.Select(prof => prof.Id).ToList()
            });
        }
        [HttpPost]
        public ActionResult CreatePredmet([FromBody] PredmetCreateDTO predmetDto)
        {
            if (string.IsNullOrWhiteSpace(predmetDto.Naziv) || predmetDto.BrojEspb <= 0)
                return BadRequest("Neispravan naziv ili broj ESPB poena.");

            var predmet = new Predmet
            {
                Naziv = predmetDto.Naziv,
                BrojEspb = predmetDto.BrojEspb
            };

            _predmetService.AddPredmet(predmet);
            return CreatedAtAction(nameof(GetPredmetById), new { id = predmet.Id }, predmet);
        }


        [HttpPut("{id}")]
        public IActionResult UpdatePredmet(int id, [FromBody] Predmet predmetDto)
        {
            if (string.IsNullOrWhiteSpace(predmetDto.Naziv) || predmetDto.BrojEspb <= 0)
                return BadRequest("Neispravan naziv ili broj ESPB poena.");

            _predmetService.UpdatePredmet(id, predmetDto.Naziv, predmetDto.BrojEspb);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePredmet(int id)
        {
            var existingPredmet = _predmetService.GetPredmetById(id);
            if (existingPredmet == null)
                return NotFound($"Predmet sa ID-jem {id} ne postoji.");

            _predmetService.DeletePredmet(id);
            return NoContent();
        }
    }
}
