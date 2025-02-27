using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTO
{
    public class RegisterProfesorDTO
    {
        [Required]
        [StringLength(20)]
        public string Ime { get; set; }

        [Required]
        [StringLength(20)]
        public string Prezime { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Zvanje { get; set; }

        public string NazivKatedre {  get; set; }
    }
}
