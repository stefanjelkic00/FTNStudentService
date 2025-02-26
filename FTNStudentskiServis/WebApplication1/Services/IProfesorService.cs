using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IProfesorService
    {
        IEnumerable<Profesor> GetAllProfesors();
        Profesor GetProfesorById(int id);
        void AddProfesor(Profesor profesor);
        void UpdateProfesor(int id, Profesor profesor);
        void DeleteProfesor(int id);

    }
}
