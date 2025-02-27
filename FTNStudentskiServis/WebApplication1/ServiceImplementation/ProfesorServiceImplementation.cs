using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServicesImplementation
{
    public class ProfesorServiceImplementation : IProfesorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPrijavaStudentaService _prijavaStudentaService; // 🆕 Dodajemo zavisnost na PrijavaStudentaService

        public ProfesorServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Profesor> GetAllProfesors()
        {
            return _context.Profesori
                .Include(p => p.User)  // ✅ Dodato da bi se povukli podaci o korisniku (Ime, Prezime)
                .Include(p => p.Katedra)
                .ToList();
        }

        public Profesor GetProfesorById(int id)
        {
            return _context.Profesori
                .Include(p => p.User)  // ✅ Dodato da bi se povukli podaci o korisniku
                .Include(p => p.Katedra)
                .FirstOrDefault(p => p.Id == id);
        }

        public void AddProfesor(Profesor profesor)
        {
            _context.Profesori.Add(profesor);
            _context.SaveChanges();
        }

        public bool UpdateProfesor(int id, ProfesorReadAndUpdateDTO profesorDto)
        {
            var existingProfesor = _context.Profesori
                .Include(p => p.User) // ✅ Uključujemo povezani User entitet
                .FirstOrDefault(p => p.Id == id);

            if (existingProfesor == null) return false;

            // ✅ Ažuriranje podataka u Profesor entitetu
            existingProfesor.Zvanje = profesorDto.Zvanje;
            existingProfesor.KatedraId = profesorDto.KatedraId;

            // ✅ Ažuriranje podataka u User entitetu ako postoji
            if (existingProfesor.User != null)
            {
                existingProfesor.User.Ime = profesorDto.Ime;
                existingProfesor.User.Prezime = profesorDto.Prezime;
            }

            // ✅ Označavamo User entitet kao modifikovan
            _context.Entry(existingProfesor.User).State = EntityState.Modified;

            _context.SaveChanges(); // ✅ Snimanje svih promena u bazi

            return true;
        }


        public void DeleteProfesor(int id)
        {
            var profesor = _context.Profesori
                .Include(p => p.User)  // ✅ Učitavamo povezani User
                .Include(p => p.Predmeti)  // ✅ Učitavamo predmete na kojima predaje
                .Include(p => p.ZahteviZaPredmete)  // ✅ Učitavamo zahteve za predmete
                .FirstOrDefault(p => p.Id == id);

            if (profesor == null) return;

            // ✅ Brisanje svih zahteva za predmete koje je profesor podneo
            var zahtevi = _context.ZahteviZaPredmete.Where(z => z.ProfesorId == id).ToList();
            _context.ZahteviZaPredmete.RemoveRange(zahtevi);

            // ✅ Uklanjanje profesora iz svih predmeta na kojima predaje
            foreach (var predmet in profesor.Predmeti.ToList())
            {
                predmet.Profesori.Remove(profesor);  // Uklanjamo profesora iz liste profesora na predmetu
            }

            // ✅ Ako postoji povezani User, brišemo ga
            if (profesor.User != null)
            {
                _context.Users.Remove(profesor.User);
            }

            // ✅ Na kraju, brišemo samog profesora
            _context.Profesori.Remove(profesor);

            _context.SaveChanges();  // ✅ Snimanje svih promena u bazi
        }



        // 🔹 Dohvatanje predmeta koje profesor predaje sa studentima
        public List<object>? DohvatiPredmeteSaStudentima(int profesorId)
        {
            var predmeti = _context.Predmeti
                .Where(p => p.Profesori.Any(pr => pr.Id == profesorId))
                .Include(p => p.PrijaveStudenta)
                    .ThenInclude(ps => ps.Student)
                    .ThenInclude(s => s.User)
                .Include(p => p.Smerovi)
                .ToList();

            if (!predmeti.Any()) return null;

            var rezultat = predmeti.GroupBy(p => p.Smerovi.FirstOrDefault()?.Naziv)
                .Select(g => new
                {
                    Smer = g.Key ?? "Nepoznat smer",
                    Predmeti = g.Select(p => new
                    {
                        PredmetId = p.Id,
                        Naziv = p.Naziv,
                        Studenti = p.PrijaveStudenta
                            .Select(ps => new
                            {
                                PrijavaId = ps.Id,
                                StudentId = ps.StudentId,
                                Ime = ps.Student.User.Ime,
                                Prezime = ps.Student.User.Prezime,
                                Index = ps.Student.Index
                            })
                            .ToList()
                    }).ToList()
                }).ToList<object>();

            return rezultat;
        }



        // 🔹 Ocenjivanje studenta
        public async Task<bool> OceniStudenta(int studentId, int predmetId, int ocena)
        {
            var prijava = await _context.PrijaveStudenta
                .FirstOrDefaultAsync(p => p.StudentId == studentId && p.PredmetId == predmetId);

            if (prijava == null)
                return false; // Student nije prijavio ispit

            if (ocena == 5)
            {
                // Ako student dobije 5, samo brišemo prijavu
                _context.PrijaveStudenta.Remove(prijava);
            }
            else
            {
                // Ako student dobije 6 ili više, upisujemo ga u `StudentiPredmeti`
                var studentPredmet = new StudentiPredmeti
                {
                    StudentId = studentId,
                    PredmetId = predmetId,
                    Ocena = ocena
                };

                await _context.StudentiPredmeti.AddAsync(studentPredmet);
                _context.PrijaveStudenta.Remove(prijava); // Brišemo prijavu jer je položio
            }

            await _context.SaveChangesAsync();
            return true;
        }





        public List<object>? DohvatiOcenjeneStudente(int profesorId)
        {
            var predmeti = _context.Predmeti
                .Where(p => p.Profesori.Any(pr => pr.Id == profesorId))
                .Include(p => p.StudentiPredmeti)
                    .ThenInclude(sp => sp.Student)
                    .ThenInclude(s => s.User)
                .Include(p => p.Smerovi)
                .ToList();

            if (!predmeti.Any()) return null;

            var rezultat = predmeti.GroupBy(p => p.Smerovi.FirstOrDefault()?.Naziv)
                .Select(g => new
                {
                    Smer = g.Key ?? "Nepoznat smer",
                    Predmeti = g.Select(p => new
                    {
                        PredmetId = p.Id,
                        Naziv = p.Naziv,
                        Studenti = p.StudentiPredmeti
                            .Select(sp => new
                            {
                                StudentId = sp.StudentId,
                                Ime = sp.Student.User.Ime,
                                Prezime = sp.Student.User.Prezime,
                                Index = sp.Student.Index,
                                Ocena = sp.Ocena
                            })
                            .ToList()
                    }).ToList()
                }).ToList<object>();

            return rezultat;
        }


        // 🔹 Dohvati predmete na koje profesor može da aplicira
        public List<object> DohvatiPredmeteZaApliciranje(int profesorId)
        {
            var predmeti = _context.Predmeti
                .Where(p => !p.Profesori.Any(pr => pr.Id == profesorId) &&
                            !_context.ZahteviZaPredmete.Any(z => z.PredmetId == p.Id && z.ProfesorId == profesorId))
                .Include(p => p.Smerovi)
                .ToList();

            var rezultat = predmeti.GroupBy(p => p.Smerovi.FirstOrDefault()?.Naziv)
                .Select(grupa => new
                {
                    Smer = grupa.Key ?? "Nepoznat smer",
                    Predmeti = grupa.Select(p => new
                    {
                        PredmetId = p.Id,
                        Naziv = p.Naziv
                    }).ToList()
                }).ToList<object>();

            return rezultat;
        }

        // 🔹 Apliciraj za predmet
        public bool AplicirajZaPredmet(int profesorId, int predmetId)
        {
            // Provera da li već postoji zahtev
            var postojiZahtev = _context.ZahteviZaPredmete
                .Any(z => z.ProfesorId == profesorId && z.PredmetId == predmetId);

            if (postojiZahtev) return false;

            var zahtev = new ZahtevZaPredmet
            {
                ProfesorId = profesorId,
                PredmetId = predmetId,
                Odobren = false
            };

            _context.ZahteviZaPredmete.Add(zahtev);
            _context.SaveChanges();
            return true;
        }

        // 🔹 Otkazivanje zahteva
        public bool OtkaziZahtev(int profesorId, int predmetId)
        {
            var zahtev = _context.ZahteviZaPredmete
                .FirstOrDefault(z => z.ProfesorId == profesorId && z.PredmetId == predmetId);

            if (zahtev == null) return false;

            _context.ZahteviZaPredmete.Remove(zahtev);
            _context.SaveChanges();
            return true;
        }

        public List<object> DohvatiMojeZahteve(int profesorId)
        {
            var zahtevi = _context.ZahteviZaPredmete
                .Where(z => z.ProfesorId == profesorId)
                .Include(z => z.Predmet)
                .ToList();

            var rezultat = zahtevi.Select(z => new
            {
                PredmetId = z.PredmetId,
                NazivPredmeta = z.Predmet.Naziv,
                Odobren = z.Odobren
            }).ToList<object>();

            return rezultat;
        }


    }
}
