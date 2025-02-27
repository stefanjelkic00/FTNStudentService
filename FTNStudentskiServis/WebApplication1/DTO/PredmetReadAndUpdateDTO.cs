namespace WebApplication1.DTO
{
    public class PredmetReadAndUpdateDTO
    {
        public int Id { get; set; }
        public string Naziv { get; set; }
        public int BrojEspb { get; set; }
        public List<int> SmerIds { get; set; } // ID-ovi smerova
        public List<int> ProfesorIds { get; set; } // ID-ovi profesora
    }
}
