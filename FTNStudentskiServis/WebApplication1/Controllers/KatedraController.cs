using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KatedraController : ControllerBase
    {
        private readonly IKatedraService _katedraService;

        public KatedraController(IKatedraService katedraService)
        {
            _katedraService = katedraService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<KatedraReadAndUpdateDTO>> GetAllKatedras()
        {
            var katedre = _katedraService.GetAllKatedras();
            if (!katedre.Any())
                return NotFound("Nema dostupnih katedri.");

            return Ok(katedre);
        }


        [HttpGet("{id}")]
        public ActionResult<KatedraReadAndUpdateDTO> GetKatedraById(int id)
        {
            var katedra = _katedraService.GetKatedraById(id);
            if (katedra == null)
                return NotFound($"Katedra sa ID-jem {id} ne postoji.");

            return Ok(new KatedraReadAndUpdateDTO
            {
                Id = katedra.Id,
                Naziv = katedra.Naziv,
                Smerovi = katedra.Smerovi?.Select(s => s.Naziv).ToList() ?? new List<string>()
            });
        }


        [HttpPost]
        public ActionResult CreateKatedra([FromBody] KatedraCreateDTO katedraDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_katedraService.GetAllKatedras().Any(k => k.Naziv == katedraDto.Naziv))
                return Conflict($"Katedra sa nazivom {katedraDto.Naziv} već postoji.");

            var katedra = new Katedra
            {
                Naziv = katedraDto.Naziv
            };

            _katedraService.AddKatedra(katedra);
            return CreatedAtAction(nameof(GetKatedraById), new { id = katedra.Id }, katedra);
        }


        [HttpPut("{id}")]
        public IActionResult UpdateKatedra(int id, [FromBody] KatedraCreateDTO katedraDto)
        {
            if (string.IsNullOrWhiteSpace(katedraDto.Naziv))
                return BadRequest("Naziv ne može biti prazan.");

            try
            {
                _katedraService.UpdateKatedra(id, katedraDto.Naziv);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/dodaj-smerove")]
        public IActionResult DodajSmeroveUKatedru(int id, [FromBody] SmerIdsDTO smerIdsDto)
        {
            if (smerIdsDto == null || smerIdsDto.SmerIds == null || !smerIdsDto.SmerIds.Any())
                return BadRequest("Lista smerova ne može biti prazna.");

            try
            {
                _katedraService.DodajSmeroveUKatedru(id, smerIdsDto.SmerIds);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        [HttpDelete("{id}")]
        public IActionResult DeleteKatedra(int id)
        {
            var existingKatedra = _katedraService.GetKatedraById(id);
            if (existingKatedra == null)
                return NotFound($"Katedra sa ID-jem {id} ne postoji.");

            _katedraService.DeleteKatedra(id);
            return NoContent();
        }
    }
}
