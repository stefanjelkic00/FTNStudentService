using System.Collections.Generic;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IStudentiPredmetiService
    {
        IEnumerable<Predmet> GetPredmetiZaPrijavu(int studentId);
        IEnumerable<StudentiPredmeti> GetPolozeniPredmeti(int studentId);
        IEnumerable<Predmet> GetSviPredmetiNaSmeru(int studentId);
        string GetSmerStudenta(int studentId); // ✔ Nova metoda za dobijanje smera studenta

        public void UnesiOcenu(int studentId, int predmetId, int ocena);

        double IzracunajProsekStudenta(int studentId);


    }
}
