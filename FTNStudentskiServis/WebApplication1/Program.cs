using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WebApplication1.Data;
using WebApplication1.ServiceImplementation;
using WebApplication1.Services;
using WebApplication1.ServicesImplementation;

var builder = WebApplication.CreateBuilder(args);

// ✅ Dodavanje servisa za bazu podataka
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Registracija servisa
builder.Services.AddScoped<IUserService, UserServiceImplementation>();
builder.Services.AddScoped<IKatedraService, KatedraServiceImplementation>();
builder.Services.AddScoped<ISmerService, SmerServiceImplementation>();
builder.Services.AddScoped<IPredmetService, PredmetServiceImplementation>();
builder.Services.AddScoped<IStudentService, StudentServiceImplementation>();
builder.Services.AddScoped<IProfesorService, ProfesorServiceImplementation>();
builder.Services.AddScoped<IPrijavaStudentaService, PrijavaStudentaServiceImplementation>();
builder.Services.AddScoped<IStudentiPredmetiService, StudentiPredmetiService>();
builder.Services.AddScoped<IAdminService, AdminServiceImplementation>(); // ✅ Dodato

// ✅ JWT konfiguracija
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// ✅ Dodavanje CORS-a
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ✅ Konfigurisanje JSON serijalizacije da reši cikličke reference
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ✅ Dodavanje Swagger-a sa JWT autentifikacijom
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WebAPLIKACIJAVEZBANJE API",
        Version = "v1",
        Description = "API za prijavu ispita i upravljanje studentima."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Unesite 'Bearer <token>' u polje Authorization."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        dbContext.Database.Migrate(); // ✅ Automatsko kreiranje baze i primena migracija
        Console.WriteLine("✅ Baza podataka je kreirana i migracije su primenjene.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Greška prilikom migracije: {ex.Message}");
    }
}


app.UseRouting();

// ✅ Omogućavanje Swagger-a i Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPLIKACIJAVEZBANJE API v1");
        c.RoutePrefix = "swagger"; // Postavlja Swagger da bude dostupan na /swagger
    });
}


app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
