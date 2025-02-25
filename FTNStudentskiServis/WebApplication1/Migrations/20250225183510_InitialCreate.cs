using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Katedre",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Katedre", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Predmeti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    BrojEspb = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predmeti", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Smerovi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Smerovi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PredmetSmer",
                columns: table => new
                {
                    PredmetiId = table.Column<int>(type: "int", nullable: false),
                    SmeroviId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PredmetSmer", x => new { x.PredmetiId, x.SmeroviId });
                    table.ForeignKey(
                        name: "FK_PredmetSmer_Predmeti_PredmetiId",
                        column: x => x.PredmetiId,
                        principalTable: "Predmeti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PredmetSmer_Smerovi_SmeroviId",
                        column: x => x.SmeroviId,
                        principalTable: "Smerovi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SmerKatedra",
                columns: table => new
                {
                    KatedreId = table.Column<int>(type: "int", nullable: false),
                    SmeroviId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmerKatedra", x => new { x.KatedreId, x.SmeroviId });
                    table.ForeignKey(
                        name: "FK_SmerKatedra_Katedre_KatedreId",
                        column: x => x.KatedreId,
                        principalTable: "Katedre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SmerKatedra_Smerovi_SmeroviId",
                        column: x => x.SmeroviId,
                        principalTable: "Smerovi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Profesori",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    KatedraId = table.Column<int>(type: "int", nullable: true),
                    Zvanje = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profesori", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profesori_Katedre_KatedraId",
                        column: x => x.KatedraId,
                        principalTable: "Katedre",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Profesori_Users_Id",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Studenti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Index = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GodinaUpisa = table.Column<int>(type: "int", nullable: false),
                    SmerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Studenti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Studenti_Smerovi_SmerId",
                        column: x => x.SmerId,
                        principalTable: "Smerovi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Studenti_Users_Id",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PredmetProfesor",
                columns: table => new
                {
                    PredmetiId = table.Column<int>(type: "int", nullable: false),
                    ProfesoriId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PredmetProfesor", x => new { x.PredmetiId, x.ProfesoriId });
                    table.ForeignKey(
                        name: "FK_PredmetProfesor_Predmeti_PredmetiId",
                        column: x => x.PredmetiId,
                        principalTable: "Predmeti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PredmetProfesor_Profesori_ProfesoriId",
                        column: x => x.ProfesoriId,
                        principalTable: "Profesori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ZahteviZaPredmete",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfesorId = table.Column<int>(type: "int", nullable: false),
                    PredmetId = table.Column<int>(type: "int", nullable: false),
                    Odobren = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZahteviZaPredmete", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ZahteviZaPredmete_Predmeti_PredmetId",
                        column: x => x.PredmetId,
                        principalTable: "Predmeti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ZahteviZaPredmete_Profesori_ProfesorId",
                        column: x => x.ProfesorId,
                        principalTable: "Profesori",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrijaveStudenta",
                columns: table => new
                {
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    PredmetId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    StatusIspita = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrijaveStudenta", x => new { x.StudentId, x.PredmetId });
                    table.ForeignKey(
                        name: "FK_PrijaveStudenta_Predmeti_PredmetId",
                        column: x => x.PredmetId,
                        principalTable: "Predmeti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrijaveStudenta_Studenti_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Studenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentiPredmeti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    PredmetId = table.Column<int>(type: "int", nullable: false),
                    Ocena = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentiPredmeti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentiPredmeti_Predmeti_PredmetId",
                        column: x => x.PredmetId,
                        principalTable: "Predmeti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentiPredmeti_Studenti_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Studenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PredmetProfesor_ProfesoriId",
                table: "PredmetProfesor",
                column: "ProfesoriId");

            migrationBuilder.CreateIndex(
                name: "IX_PredmetSmer_SmeroviId",
                table: "PredmetSmer",
                column: "SmeroviId");

            migrationBuilder.CreateIndex(
                name: "IX_PrijaveStudenta_PredmetId",
                table: "PrijaveStudenta",
                column: "PredmetId");

            migrationBuilder.CreateIndex(
                name: "IX_Profesori_KatedraId",
                table: "Profesori",
                column: "KatedraId");

            migrationBuilder.CreateIndex(
                name: "IX_SmerKatedra_SmeroviId",
                table: "SmerKatedra",
                column: "SmeroviId");

            migrationBuilder.CreateIndex(
                name: "IX_Studenti_SmerId",
                table: "Studenti",
                column: "SmerId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentiPredmeti_PredmetId",
                table: "StudentiPredmeti",
                column: "PredmetId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentiPredmeti_StudentId",
                table: "StudentiPredmeti",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaPredmete_PredmetId",
                table: "ZahteviZaPredmete",
                column: "PredmetId");

            migrationBuilder.CreateIndex(
                name: "IX_ZahteviZaPredmete_ProfesorId",
                table: "ZahteviZaPredmete",
                column: "ProfesorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PredmetProfesor");

            migrationBuilder.DropTable(
                name: "PredmetSmer");

            migrationBuilder.DropTable(
                name: "PrijaveStudenta");

            migrationBuilder.DropTable(
                name: "SmerKatedra");

            migrationBuilder.DropTable(
                name: "StudentiPredmeti");

            migrationBuilder.DropTable(
                name: "ZahteviZaPredmete");

            migrationBuilder.DropTable(
                name: "Studenti");

            migrationBuilder.DropTable(
                name: "Predmeti");

            migrationBuilder.DropTable(
                name: "Profesori");

            migrationBuilder.DropTable(
                name: "Smerovi");

            migrationBuilder.DropTable(
                name: "Katedre");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
