using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.DTO;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            Console.WriteLine($"Prijava pokušaj za korisnika: {loginDto.Username}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState nije validan.");
                return BadRequest("Invalid input.");
            }

            try
            {
                var user = await _userService.LoginAsync(loginDto.Username, loginDto.Password);
                if (user == null)
                {
                    Console.WriteLine("Korisnik nije pronađen ili lozinka nije ispravna.");
                    return BadRequest(new { message = "Neispravni podaci za prijavu." });
                }

                var stringKey = _configuration["Jwt:Key"];
                if (string.IsNullOrEmpty(stringKey))
                {
                    Console.WriteLine("Greška: Jwt:Key nije pronađen u konfiguraciji.");
                    return StatusCode(500, new { message = "Internal server error: JWT key missing." });
                }

                var key = Encoding.ASCII.GetBytes(stringKey);
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Role, user.Role)
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                Console.WriteLine($"Prijava uspešna za korisnika: {user.Username}");

                return Ok(new
                {
                    Message = "Prijava uspešna.",
                    Token = tokenHandler.WriteToken(token),
                    User = new
                    {
                        user.Id,
                        user.Ime,
                        user.Prezime,
                        user.Username,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom prijave: {ex.Message}");
                return StatusCode(500, new { message = $"Došlo je do greške: {ex.Message}" });
            }
        }

        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDTO registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid input.");

            try
            {
                var existingUser = await _userService.GetUserByUsernameAsync(registerDto.Username);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Korisnik sa ovim korisničkim imenom već postoji." });
                }
                

                var newUser = await _userService.RegisterStudentAsync(
                    registerDto.Ime,
                    registerDto.Prezime,
                    registerDto.Username,
                    registerDto.Password,
                    registerDto.Index,
                    registerDto.GodinaUpisa,
                    registerDto.SmerId
                );

                return Ok(new { Message = "Registracija uspešna.", User = newUser });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register/profesor")]
        public async Task<IActionResult> RegisterProfesor([FromBody] RegisterProfesorDTO registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid input.");

            try
            {
                var existingUser = await _userService.GetUserByUsernameAsync(registerDto.Username);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Korisnik sa ovim korisničkim imenom već postoji." });
                }

                var newUser = await _userService.RegisterProfesorAsync(
                    registerDto.Ime,
                    registerDto.Prezime,
                    registerDto.Username,
                    registerDto.Password,
                    registerDto.Zvanje,
                    registerDto.NazivKatedre);

                return Ok(new { Message = "Registracija uspešna.", User = newUser });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                    return Unauthorized("Niste prijavljeni.");

                var userProfile = await _userService.GetUserProfileAsync(userId);
                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            try
            {
                var result = await _userService.ChangePasswordAsync(
                    changePasswordDto.Username,
                    changePasswordDto.CurrentPassword,
                    changePasswordDto.NewPassword
                );

                if (!result)
                    return BadRequest("Failed to change password.");

                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
