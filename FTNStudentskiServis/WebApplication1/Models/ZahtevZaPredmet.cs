using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class ZahtevZaPredmet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProfesorId { get; set; }
        public Profesor Profesor { get; set; }

        [Required]
        public int PredmetId { get; set; }
        public Predmet Predmet { get; set; }

        public bool Odobren { get; set; } // True = prihvaćen, False = odbijen
    }
}
