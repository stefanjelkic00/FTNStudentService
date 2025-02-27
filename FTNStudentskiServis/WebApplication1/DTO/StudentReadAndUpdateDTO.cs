namespace WebApplication1.DTO
{
    public class StudentReadAndUpdateDTO
    {
        public int Id { get; set; }
        public string Index { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public int GodinaUpisa { get; set; }

        public int? SmerId { get; set; } // Dodato SmerId public int? SmerId { get; set; } // Promenjeno u nullable

    }
}
