public class RegisterStudentDTO
{
    public string Ime { get; set; }
    public string Prezime { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Index { get; set; }
    public int GodinaUpisa { get; set; }
    public int? SmerId { get; set; } // ✔ Dodato
}
