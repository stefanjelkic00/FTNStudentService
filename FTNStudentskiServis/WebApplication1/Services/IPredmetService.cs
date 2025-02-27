using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IPredmetService
    {
        IEnumerable<Predmet> GetAllPredmets();
        Predmet GetPredmetById(int id);
        void AddPredmet(Predmet predmet);
        void UpdatePredmet(int id, string naziv , int brojEspb);
        void DeletePredmet(int id);
    }
}
