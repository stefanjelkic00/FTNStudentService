namespace WebApplication1.DTO
{
        public class SmerReadAndUpdateDTO
        {
            public int Id { get; set; }
            public string Naziv { get; set; }
            public List<int> KatedraIds { get; set; }
            public List<int> PredmetIds { get; set; }
        }
    }

