namespace WebApplication1.Models
{
    public class Smer
    {
        public int Id { get; set; }
        public string Naziv { get; set; }

        public ICollection<Katedra> Katedre { get; set; } = new List<Katedra>();

        public ICollection<Predmet> Predmeti { get; set; } = new List<Predmet>();
    }
}
