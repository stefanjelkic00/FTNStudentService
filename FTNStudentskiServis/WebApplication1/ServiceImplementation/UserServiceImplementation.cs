using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.ServiceImplementation
{
    public class UserServiceImplementation : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserServiceImplementation(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> RegisterStudentAsync(string ime, string prezime, string username, string password, string index, int godinaUpisa, int? smerId)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (existingUser != null)
                throw new Exception($"User with username '{username}' already exists.");

            var newUser = new User
            {
                Ime = ime,
                Prezime = prezime,
                Username = username,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Student"
            };

            var student = new Student
            {
                Id = newUser.Id,
                Index = index,
                GodinaUpisa = godinaUpisa,
                SmerId = smerId // ✔ SmerId se sada dodeljuje ispravno!
            };

            newUser.Student = student;

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }


        public async Task<User> RegisterProfesorAsync(string ime, string prezime, string username, string password, string zvanje, string nazivKatedre)
        {
            // Provera da li korisnik sa datim korisničkim imenom već postoji
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (existingUser != null)
                throw new Exception($"User with username '{username}' already exists.");

            // Pronalazak ID-a katedre na osnovu njenog naziva
            var katedra = await _context.Katedre.FirstOrDefaultAsync(k => k.Naziv == nazivKatedre);
            if (katedra == null)
                throw new Exception($"Katedra sa nazivom '{nazivKatedre}' ne postoji.");

            // Kreiranje novog korisnika
            var newUser = new User
            {
                Ime = ime,
                Prezime = prezime,
                Username = username,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Profesor"
            };

            // Kreiranje novog profesora
            var professor = new Profesor
            {
                Id = newUser.Id,
                Zvanje = zvanje,
                KatedraId = katedra.Id
            };

            newUser.Profesor = professor;

            // Dodavanje novog korisnika u bazu
            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<User> LoginAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                throw new Exception("Invalid username or password.");

            return user;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Student)
                .Include(u => u.Profesor)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Student> GetStudentByUserIdAsync(int userId)
        {
            return await _context.Studenti.FirstOrDefaultAsync(s => s.Id == userId);
        }

        public async Task<Profesor> GetProfesorByUserIdAsync(int userId)
        {
            return await _context.Profesori
                .Include(p => p.Katedra)
                .FirstOrDefaultAsync(p => p.Id == userId);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<bool> ChangePasswordAsync(string username, string currentPassword, string newPassword)
        {
            // Pronalazak korisnika na osnovu korisničkog imena
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception("User not found.");

            // Provera trenutne lozinke
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
                throw new Exception("Current password is incorrect.");

            // Ažuriranje lozinke
            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }


    }
}
