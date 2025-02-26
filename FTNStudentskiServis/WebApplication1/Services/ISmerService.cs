using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface ISmerService
    {
        IEnumerable<Smer> GetAllSmerovi();
        Smer GetSmerById(int id);
        void AddSmer(Smer smer, List<int> katedraIds, List<int> predmetIds);
        void UpdateSmer(int id, Smer smer, List<int> katedraIds, List<int> predmetIds);
        void DeleteSmer(int id);

    }
}
