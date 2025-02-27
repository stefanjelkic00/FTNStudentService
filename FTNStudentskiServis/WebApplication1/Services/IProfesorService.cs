using WebApplication1.DTO;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IProfesorService
    {
        IEnumerable<Profesor> GetAllProfesors();
        Profesor GetProfesorById(int id);
        void AddProfesor(Profesor profesor);
        bool UpdateProfesor(int id, ProfesorReadAndUpdateDTO profesorDto);
        void DeleteProfesor(int id);
        List<object>? DohvatiPredmeteSaStudentima(int profesorId);
        Task<bool> OceniStudenta(int studentId, int predmetId, int ocena);


        public List<object>? DohvatiOcenjeneStudente(int profesorId);

        public List<object> DohvatiPredmeteZaApliciranje(int profesorId);

        public bool AplicirajZaPredmet(int profesorId, int predmetId);
        public bool OtkaziZahtev(int profesorId, int predmetId);


        public List<object> DohvatiMojeZahteve(int profesorId);


      
        


    }
}