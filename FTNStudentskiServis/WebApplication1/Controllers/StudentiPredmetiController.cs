using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Services;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/studenti-predmeti")]
    [ApiController]
    [Authorize(Roles = "Student")] // ✔ Ograničavamo pristup samo studentima
    public class StudentiPredmetiController : ControllerBase
    {
        private readonly IStudentiPredmetiService _service;

        public StudentiPredmetiController(IStudentiPredmetiService service)
        {
            _service = service;
        }

        // 🔹 Položeni predmeti u za datog studenta 
        [HttpGet("polozeni-predmeti/{studentId}")]
        public ActionResult<IEnumerable<object>> GetPolozeniPredmeti(int studentId)
        {
            var polozeni = _service.GetPolozeniPredmeti(studentId)
                .Select(p => new
                {
                    PredmetId = p.Predmet.Id,
                    Naziv = p.Predmet.Naziv,
                    Ocena = p.Ocena,
                    BrojEspb = p.Predmet.BrojEspb // ✔ Dodajemo ESPB bodove
                })
                .ToList();

            return Ok(polozeni);
        }


        [Authorize(Roles = "Student")]
        [HttpGet("prosek/{studentId}")]
        public ActionResult<double> GetProsekStudenta(int studentId)
        {
            var prosek = _service.IzracunajProsekStudenta(studentId);
            return Ok(prosek);
        }

        [HttpGet("svi-predmeti/{studentId}")]
        public ActionResult<object> GetSviPredmetiZaStudenta(int studentId)
        {
            var smer = _service.GetSmerStudenta(studentId);
            if (smer == null)
            {
                return NotFound("Student nije pronađen ili nema dodeljen smer.");
            }

            var predmeti = _service.GetSviPredmetiNaSmeru(studentId)
                .Select(p => new
                {
                    Id = p.Id,
                    Naziv = p.Naziv,
                    BrojEspb = p.BrojEspb
                })
                .ToList();

            return Ok(new { smer, predmeti });
        }


    }
}
