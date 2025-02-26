using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IKatedraService
    {
        IEnumerable<Katedra> GetAllKatedras();
        Katedra GetKatedraById(int id);
        void AddKatedra(Katedra katedra);
        void UpdateKatedra(int id, Katedra katedra);
        void DeleteKatedra(int id);
    }
}