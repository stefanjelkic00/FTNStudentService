using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface ISmerService
    {
        IEnumerable<Smer> GetAllSmerovi();
        Smer GetSmerById(int id);
        void AddSmer(Smer smer);
        void UpdateSmer(int id, string naziv);
        void DeleteSmer(int id);
        void DodajPredmeteUSmer(int smerId, List<int> predmetIds);
    }
}