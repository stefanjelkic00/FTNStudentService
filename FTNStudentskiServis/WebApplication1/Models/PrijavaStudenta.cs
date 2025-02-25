using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class PrijavaStudenta
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [ForeignKey("Predmet")]
        public int PredmetId { get; set; }
        public Predmet Predmet { get; set; }
        public bool StatusIspita { get; set; }
    }
}
