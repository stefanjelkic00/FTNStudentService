using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Services;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("zahtevi")]
    public IActionResult GetAllZahtevi()
    {
        var zahtevi = _adminService.GetAllZahtevi();
        return zahtevi != null ? Ok(zahtevi) : NotFound("Nema zahteva.");
    }

    [HttpPost("odobri/{id}")]
    public IActionResult OdobriZahtev(int id)
    {
        var rezultat = _adminService.OdobriZahtev(id);
        return rezultat ? Ok(new { message = "Zahtev je odobren." }) : BadRequest("Zahtev nije moguće odobriti.");
    }

    [HttpDelete("odbij/{id}")]
    public IActionResult OdbijZahtev(int id)
    {
        var rezultat = _adminService.OdbijZahtev(id);
        return rezultat ? Ok(new { message = "Zahtev je odbijen." }) : BadRequest("Zahtev nije moguće odbiti.");
    }
}
