using WebApplication1.DTO;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IKatedraService
    {
        public IEnumerable<KatedraReadAndUpdateDTO> GetAllKatedras();
        Katedra GetKatedraById(int id);
        void AddKatedra(Katedra katedra);
        void UpdateKatedra(int id, string naziv);
        void DodajSmeroveUKatedru(int katedraId, List<int> smerIds);

        void DeleteKatedra(int id);
    }
}