using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;

public class AdminServiceImplementation : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminServiceImplementation(ApplicationDbContext context)
    {
        _context = context;
    }

    public IEnumerable<object> GetAllZahtevi()
    {
        return _context.ZahteviZaPredmete
            .Include(z => z.Profesor)
            .ThenInclude(p => p.User)
            .Include(z => z.Predmet)
            .Where(z => !z.Odobren) // ✅ DODATO: Filtrira samo neodobrene zahteve
            .Select(z => new
            {
                z.Id,
                Profesor = new
                {
                    z.Profesor.Id,
                    z.Profesor.Zvanje,
                    Ime = z.Profesor.User.Ime,
                    Prezime = z.Profesor.User.Prezime,
                    Username = z.Profesor.User.Username
                },
                Predmet = new
                {
                    z.Predmet.Id,
                    z.Predmet.Naziv
                },
                z.Odobren
            })
            .ToList();
    }



    public bool OdobriZahtev(int zahtevId)
    {
        var zahtev = _context.ZahteviZaPredmete.Include(z => z.Predmet).FirstOrDefault(z => z.Id == zahtevId);
        if (zahtev == null || zahtev.Odobren) return false;

        // Dodavanje profesora u predmet
        var predmet = _context.Predmeti.Include(p => p.Profesori).FirstOrDefault(p => p.Id == zahtev.PredmetId);
        var profesor = _context.Profesori.Find(zahtev.ProfesorId);

        if (predmet == null || profesor == null) return false;

        predmet.Profesori.Add(profesor);
        zahtev.Odobren = true;

        _context.SaveChanges();
        return true;
    }

    public bool OdbijZahtev(int zahtevId)
    {
        var zahtev = _context.ZahteviZaPredmete.Find(zahtevId);
        if (zahtev == null) return false;

        _context.ZahteviZaPredmete.Remove(zahtev);
        _context.SaveChanges();
        return true;
    }
}
