using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models
{
    public class Predmet
    {
        public int Id { get; set; }

        [Required]
        [StringLength(60, ErrorMessage = "Naziv ne može biti duže od 30 karaktera.")]
        public string Naziv { get; set; }

        [Required]
        [Range(1, 30, ErrorMessage = "Broj ESPB mora biti između 1 i 30.")]
        public int BrojEspb { get; set; }

        // Many-to-Many relacija sa Smer preko postojeće tabele PredmetSmer
        public ICollection<Smer> Smerovi { get; set; } = new List<Smer>();

        public ICollection<PrijavaStudenta> PrijaveStudenta { get; set; } = new List<PrijavaStudenta>();


        public ICollection<StudentiPredmeti> StudentiPredmeti { get; set; } = new List<StudentiPredmeti>();

        // Many-to-Many relacija sa Profesorima
        public ICollection<Profesor> Profesori { get; set; } = new List<Profesor>();
        // 🔹 Dodato - Predmet može imati više zahteva profesora
        public ICollection<ZahtevZaPredmet> ZahteviZaPredmete { get; set; } = new List<ZahtevZaPredmet>();

    }
}
