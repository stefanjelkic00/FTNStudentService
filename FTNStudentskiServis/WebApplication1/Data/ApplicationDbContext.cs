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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 📌 Eksplicitno podešavanje imena tabela
            modelBuilder.Entity<Student>().ToTable("Studenti");
            modelBuilder.Entity<Katedra>().ToTable("Katedre");
            modelBuilder.Entity<Predmet>().ToTable("Predmeti");
            modelBuilder.Entity<Profesor>().ToTable("Profesori");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Smer>().ToTable("Smerovi");
            modelBuilder.Entity<PrijavaStudenta>().ToTable("PrijaveStudenta");
            modelBuilder.Entity<ZahtevZaPredmet>().ToTable("ZahteviZaPredmete");

            // ✔ Relacija Student-Smer (1:N)
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Smer)
                .WithMany()
                .HasForeignKey(s => s.SmerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacija User -> Student
            modelBuilder.Entity<User>()
                .HasOne(u => u.Student)
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacija User -> Profesor
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profesor)
                .WithOne(p => p.User)
                .HasForeignKey<Profesor>(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacija Profesor -> Katedra
            modelBuilder.Entity<Profesor>()
                .HasOne(p => p.Katedra)
                .WithMany(k => k.Profesori)
                .HasForeignKey(p => p.KatedraId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relacija PrijavaStudenta (M:N)
            modelBuilder.Entity<PrijavaStudenta>()
                .HasKey(p => new { p.StudentId, p.PredmetId });

            modelBuilder.Entity<PrijavaStudenta>()
                .HasOne(p => p.Student)
                .WithMany(s => s.PrijavaStudenta)
                .HasForeignKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PrijavaStudenta>()
                .HasOne(p => p.Predmet)
                .WithMany(c => c.PrijaveStudenta)
                .HasForeignKey(p => p.PredmetId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacija Smer -> Katedra (M:N)
            modelBuilder.Entity<Smer>()
                .HasMany(s => s.Katedre)
                .WithMany(k => k.Smerovi)
                .UsingEntity(j => j.ToTable("SmerKatedra"));

            // Relacija Predmet -> Smer (M:N)
            modelBuilder.Entity<Predmet>()
                .HasMany(p => p.Smerovi)
                .WithMany(s => s.Predmeti)
                .UsingEntity(j => j.ToTable("PredmetSmer"));

            // Relacija Predmet -> Profesor (M:N)
            modelBuilder.Entity<Predmet>()
                .HasMany(p => p.Profesori)
                .WithMany(prof => prof.Predmeti)
                .UsingEntity(j => j.ToTable("PredmetProfesor"));

            // ✅ REŠEN PROBLEM: Relacija ZahtevZaPredmet -> Profesor i Predmet
            modelBuilder.Entity<ZahtevZaPredmet>()
                .HasOne(z => z.Profesor)
                .WithMany(p => p.ZahteviZaPredmete)
                .HasForeignKey(z => z.ProfesorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ZahtevZaPredmet>()
                .HasOne(z => z.Predmet)
                .WithMany(p => p.ZahteviZaPredmete) // ✅ Ovo dodaj u Predmet.cs
                .HasForeignKey(z => z.PredmetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
