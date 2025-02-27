using WebApplication1.Models;

public interface IPrijavaStudentaService
{
    Task<List<Predmet>> GetPrijavljeniPredmeti(int studentId);
    Task<List<Predmet>> GetPredmetiZaPrijavu(int studentId);
    Task<bool> PrijaviIspit(int studentId, int predmetId);
}
