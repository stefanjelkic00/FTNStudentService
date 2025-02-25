using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models // Prilagodi namespace ako je drugačiji
{
    public class Katedra
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(60, ErrorMessage = "Naziv ne može biti duže od 60 karaktera.")]
        public string Naziv { get; set; }

        // Relacija sa smerovima (M:N relacija)
        public ICollection<Smer> Smerovi { get; set; } = new List<Smer>();

        public ICollection<Profesor> Profesori { get; set; }
    }
}
