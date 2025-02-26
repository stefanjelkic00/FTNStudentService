using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IUserService
    {
        Task<User> RegisterStudentAsync(string ime, string prezime, string username, string password, string index, int godinaUpisa, int? smerId); // ✔ Dodato smerId
        Task<User> RegisterProfesorAsync(string ime, string prezime, string username, string password, string zvanje, string nazivKatedre);
        Task<User> LoginAsync(string username, string password);
        Task<User> GetUserByIdAsync(int id);
        Task<Student> GetStudentByUserIdAsync(int userId);
        Task<Profesor> GetProfesorByUserIdAsync(int userId);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<bool> ChangePasswordAsync(string username, string currentPassword, string newPassword);

    }
}
