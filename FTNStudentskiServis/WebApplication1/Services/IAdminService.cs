using WebApplication1.Models;

public interface IAdminService
{
    public IEnumerable<object> GetAllZahtevi();
    bool OdobriZahtev(int zahtevId);
    bool OdbijZahtev(int zahtevId);
}
