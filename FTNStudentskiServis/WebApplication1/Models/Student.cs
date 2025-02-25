using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Student
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; }

        [Required]
        public string Index { get; set; }

        [Required]
        public int GodinaUpisa { get; set; }

        public User User { get; set; }

        public ICollection<PrijavaStudenta> PrijavaStudenta { get; set; } = new List<PrijavaStudenta>();

        public ICollection<StudentiPredmeti> StudentiPredmeti { get; set; } = new List<StudentiPredmeti>();

        [ForeignKey("Smer")]
        public int? SmerId { get; set; }
        public Smer Smer { get; set; }
    }
}
