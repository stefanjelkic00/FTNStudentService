using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using WebAPLIKACIJAVEZBANJE.Enums;

namespace WebApplication1.Models
{
    public class PrijavaStudenta
    {
        [Key]  // ✅ Primarni ključ, auto-generisan
        public int Id { get; set; }

        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [ForeignKey("Predmet")]
        public int PredmetId { get; set; }
        public Predmet Predmet { get; set; }
        public bool StatusIspita { get; set; } // ✅ True = Položen, False = Nepoložen
    }
}
