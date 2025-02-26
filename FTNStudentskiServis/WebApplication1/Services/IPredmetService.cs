using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IPredmetService
    {
        IEnumerable<Predmet> GetAllPredmets();
        Predmet GetPredmetById(int id);
        void AddPredmet(Predmet predmet, List<int> smerIds, List<int> profesorIds);
        void UpdatePredmet(int id, Predmet predmet, List<int> smerIds, List<int> profesorIds);
        void DeletePredmet(int id);
    }
}
