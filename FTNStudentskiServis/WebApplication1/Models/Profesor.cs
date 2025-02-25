using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Profesor
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; }

        [ForeignKey("Katedra")]
        public int? KatedraId { get; set; }

        public Katedra Katedra { get; set; }

        public User User { get; set; }

        public string Zvanje { get; set; }

        public ICollection<Predmet> Predmeti { get; set; } = new List<Predmet>();

        public ICollection<ZahtevZaPredmet> ZahteviZaPredmete { get; set; } = new List<ZahtevZaPredmet>();
    }
}
