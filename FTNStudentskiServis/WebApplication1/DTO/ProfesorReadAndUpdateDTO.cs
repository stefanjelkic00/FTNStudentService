namespace WebApplication1.DTO
{
    public class ProfesorReadAndUpdateDTO
    {
        public int Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Zvanje { get; set; }
        public int? KatedraId { get; set; }
        public string KatedraNaziv { get; set; }
    }
}
