using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Student> Studenti { get; set; }
        public DbSet<Katedra> Katedre { get; set; }
        public DbSet<Predmet> Predmeti { get; set; }
        public DbSet<Profesor> Profesori { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Smer> Smerovi { get; set; }
        public DbSet<PrijavaStudenta> PrijaveStudenta { get; set; }
        public DbSet<ZahtevZaPredmet> ZahteviZaPredmete { get; set; }
        public DbSet<StudentiPredmeti> StudentiPredmeti { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 🔹 Relacija Student-Smer (1:N)
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Smer)
                .WithMany()
                .HasForeignKey(s => s.SmerId)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 Relacija User -> Student
            modelBuilder.Entity<User>()
                .HasOne(u => u.Student)
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 Relacija User -> Profesor
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profesor)
                .WithOne(p => p.User)
                .HasForeignKey<Profesor>(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 Relacija Profesor -> Katedra (1:N)
            modelBuilder.Entity<Profesor>()
                .HasOne(p => p.Katedra)
                .WithMany(k => k.Profesori)
                .HasForeignKey(p => p.KatedraId)
                .OnDelete(DeleteBehavior.SetNull);

            // 🔹 Relacija PrijavaStudenta
            modelBuilder.Entity<PrijavaStudenta>()
                .HasKey(p => p.Id);

            modelBuilder.Entity<PrijavaStudenta>()
                .HasOne(p => p.Student)
                .WithMany(s => s.PrijavaStudenta)
                .HasForeignKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<PrijavaStudenta>()
                .HasOne(p => p.Predmet)
                .WithMany(p => p.PrijaveStudenta)
                .HasForeignKey(p => p.PredmetId)
                .OnDelete(DeleteBehavior.NoAction);

            // 🔹 Relacija Smer -> Katedra (M:N)
            modelBuilder.Entity<Smer>()
                .HasMany(s => s.Katedre)
                .WithMany(k => k.Smerovi)
                .UsingEntity(j => j.ToTable("SmerKatedra"));

            // 🔹 Relacija Predmet -> Smer (M:N)
            modelBuilder.Entity<Predmet>()
                .HasMany(p => p.Smerovi)
                .WithMany(s => s.Predmeti)
                .UsingEntity(j => j.ToTable("PredmetSmer"));

            // 🔹 Relacija Predmet -> Profesor (M:N)
            modelBuilder.Entity<Predmet>()
                .HasMany(p => p.Profesori)
                .WithMany(prof => prof.Predmeti)
                .UsingEntity(j => j.ToTable("PredmetProfesor"));

            // 🔹 Relacija ZahtevZaPredmet
            modelBuilder.Entity<ZahtevZaPredmet>()
                .HasOne(z => z.Profesor)
                .WithMany(p => p.ZahteviZaPredmete)
                .HasForeignKey(z => z.ProfesorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ZahtevZaPredmet>()
                .HasOne(z => z.Predmet)
                .WithMany(p => p.ZahteviZaPredmete)
                .HasForeignKey(z => z.PredmetId)
                .OnDelete(DeleteBehavior.NoAction);

            // 🔹 Relacija StudentiPredmeti (sa IDENTITY)
            modelBuilder.Entity<StudentiPredmeti>()
                .HasKey(sp => sp.Id); // ✅ Koristimo ID kao primarni ključ

            modelBuilder.Entity<StudentiPredmeti>()
                .Property(sp => sp.Id)
                .UseIdentityColumn(); // ✅ Automatsko generisanje ID-ja

            modelBuilder.Entity<StudentiPredmeti>()
                .HasOne(sp => sp.Student)
                .WithMany(s => s.StudentiPredmeti)
                .HasForeignKey(sp => sp.StudentId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StudentiPredmeti>()
                .HasOne(sp => sp.Predmet)
                .WithMany(p => p.StudentiPredmeti)
                .HasForeignKey(sp => sp.PredmetId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
