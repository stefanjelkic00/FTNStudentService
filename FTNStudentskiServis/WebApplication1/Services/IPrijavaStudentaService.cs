using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IPrijavaStudentaService
    {
        Task<List<Predmet>> GetPrijavljeniPredmeti(int studentId);
        Task<List<Predmet>> GetPolozeniPredmeti(int studentId);
        Task<(bool Success, string Message)> PrijaviIspit(int studentId, int predmetId);
        void UnesiOcenu(int studentId, int predmetId, int ocena);
        double IzracunajProsekStudenta(int studentId);
    }
}
