FTNStudentService je aplikacija namenjena studentima i osoblju Fakulteta tehničkih nauka, 
pružajući različite usluge poput pregleda predmeta, prijave ispita i ocenjivanja istih.
Logika je napravljena kao nadovezujuca logika na vec postojeci sajt Fakulteta tehnickih nauka, 
sa ciljem da ima ulogu studentskog web servisa i profesorskog web servisa. 

Tehnologije koje su koriscene su :
  Bekend: ASP.NET Core​
  Frontend: React.js​
  Baza podataka: SQL Server

Bekend:
  .NET 8 (ASP.NET Core Web API) - Verzija koja je koriscena. 
  Entity Framework Core (EF Core) - ORM (Object-Relational Mapping) alat za jednostavan rad sa bazom podataka pomoću C# objekata.
  SQL Server – relaciona baza podataka korišćena za čuvanje svih entiteta (useri, katedre, smerovi, predmeti,ostale medju relacije i povezanosti).
  JWT (JSON Web Token) – za autentifikaciju i autorizaciju korisnika sistema (student, profesor, admin).
  Swagger – dokumentacija i testiranje API-ja direktno iz browsera.


Modularna struktura unutar bekend dela. 
Svi servisi, interfejsi i logika razdvojeni po odgovornosti (IService, ServiceImplementation, Controller).

Pokretanje bekenda: dotnet run 
  ovo je putanja ka bekendu: http://localhost:5299/api


Frontend:
  React – JavaScript biblioteka za izradu brzog i interaktivnog korisničkog interfejsa (SPA).
  Axios – HTTP klijent korišćen za komunikaciju sa .NET backend API-jem.
  React Bootstrap – React komponente bazirane na Bootstrap frameworku za brži razvoj responzivnog i konzistentnog dizajna.
  Formik – biblioteka za upravljanje formama i validacijom u React aplikacijama.
  Yup – biblioteka za validaciju formi koja se koristi u kombinaciji sa Formik-om.
  JWT Decode – dekodiranje JWT tokena na klijentskoj strani radi autorizacije i prikaza sadržaja u zavisnosti od uloge korisnika.
  React Toastify – prikazivanje notifikacija i korisničkih poruka.

Pokretanje frontenda:
    Instalirati sve zavisnosti: npm install
    Pokrenuti React aplikaciju: npm start
    Aplikacija će biti dostupna na: http://localhost:3000


Baza podataka: 
  SQL Server (Microsoft SQL Server).
  Podatke za unos katedri , smerova i predmeta uneti kroz upit koji ce se nalaziti na dnu read me fajla . 
  Relacije izmedju njih takodje. 
  Sto se tice profesora i studenata njih najbolje rucno uneti putem registracije.
  Administratora uneti rucno kroz upit u bazi jer za njega ne postoji registracija.
  Sto se tice svih ostalih tabela one ce se popunjavati daljim testiranjem aplikacije i za unosenjem podataka kroz upit nema potrebe.

Svi queriji ce se nalaziti na dnu ispod opisa funkcionalnosti.




Funkcionalnosti:
  Svi: Ovo su funkcionalnosti pocetne stranice kojima ne treba korisnik ni da bude ulogovan da bih mogao pristupiti.
    Pocetna stranica u sebi sadrzi opste informacije o nasem sajtu. 
    Skroz gore postoje dugmad za prikaz fakultetskih informacija gde nas vodi u narednu stranicu u prikaz svih katedri i smerova .
    Kada se klikne na neku katedru vodi nas u novi prozor gde nam ispisuje pored naziva katedre i sve smerove koji pripadaju izabranoj katedri.
    Kada se klikne na neki smer vodi nas na nov prozor gde nam ispisuje pored naziva smera sve predmete koji pripadaju tom smeru i imena profesora koji predaju na tim predmetima.
    Sledece na pocetnoj stranici je dugme sa kontaktom koje nas vodi na pravu sekciju oficijalnog sajta Fakulteta tehnickih nauka u kontakt deo sobzirom da je logika sajta nadovezivanje na ftn sajt.
    Ispod toga se nalaze neke osnovne informacije o fakultetu tehnickih nauka, broj studenata, zaposlenih, laboratorija, biblioteckih jedinica i departmana.
    Uz to se nalaze i slike fakulteta i grada Novog Sada odakle i potice fakultet.
    Ispod toga se nalazi deo sa vestima a ispod toga se nalazi dugme koje nas vodi na pravi ftn sajt i upis u narednu godinu.
    Ispod toga se nalaze slike nekih od glavnih Ftn-ovih objekata i ispod toga imamo dugme koje nas vodi na pocetnu stranicu uz opis "Pridruži se FTN zajednici".
    
  Student:
    Ima dugme profil koje ga vodi na licne podatke i mogucnost promene lozinke.
    Kada se uloguje automatski ga vodi na profile page.
    Ima u prozoru prikaz smera sa prikazom svih predmeta koji se nalaze u tom smeru i brojem ESPB bodova koje svaki od tih predmeta ima.
    Ima u novom prozoru mogucnost prijave ispita koji mu nisu prijavljeni za polaganje.
    Ima u narednom prozoru prikaz polozenih predmeta gde pisu njihovi nazivi zasebni brojevi ESPB bodova i ocena. 
    Takodje postoje i prikaz ukupnog broja ESPB bodova i prosecne ocene od svih polozenih predmeta datog studenta.
    U narednom prozoru postoji sekcija sa ispisom svih prijavljenih predmeta gde student moze da vidi koje sve predmete je prijavio za polaganje.

  Profesor:
    Ima dugme profil koje ga vodi na licne podatke i mogucnost promene lozinke.
    Kada se uloguje automatski ga vodi na profile page.
    Ima prozor pod nazivom  "Moji predmeti i prijavljeni studenti" gde se nalaze rasporedjeni svi predmeti po smerovima i ispod njih se nalaze prijave za te predmete od strane studenata.
    Profesor ima duznost da te predmete oceni studentima sa ocenama od 5-10. 
    Sledeci prozor je "Ocenjeni studenti" gde profesor ima uvid u sve prijave ispita koje je ocenio sa prolaznom ocenom. 
    Boje oko ocene se menjaju spram ocene koju je profesor dodelio.
      6-crvena.
      7,8-zuta.
      9-10-zelena.
    Sledeci prozor je "Predmeti za apliciranje" gde se ispisuju svi predmeti na kojima profesor ne predaje i postoje dugmad za mogucnost apliciranja na te predmete da se dodele i tom profesoru.
    Sledeci prozor je "Moji zahtevi" gde se ispisuju svi zahtevi za koje je profesor podneo prijavu. 
    U slucaju da ih mu je administrator odobrio pisace zelenim u desnoj strani odobren, dok je na cekanju pisace u zutom okviru na cekanju i pored crvenim okvirom otkazi.

    
Admin:
  Ima dugme profil koje ga vodi na licne podatke i mogucnost promene lozinke.
  Kada se uloguje automatski ga vodi na profile page.
  Ima prozor "Zahtevi profesora" gde mu se ispisuju svi podneti zahtevi od strane profesora za apliciranje na predmet gde ce admin imati mogucnost da odobri ili odbije taj zahtev.
  Sledeci prozor je "Korisnici" gde mu se ispisuju svi korisnici aplikacije koji su registrovani pod reonima studenti i profesori, imace mogucnost za uklanjanje korisnika u potpunosti i sve njihove logike do tad.
  Sledeci prozor je "Katedre" gde ce korisnik imati kompletan CRUD za katedre.
  Sledeci prozor je "Smerovi" gde ce korisnik imati kompletan CRUD za smerove.
  Sledeci prozor je "Predmeti" gde ce korisnik imati kompletan CRUD za predmete.



Query upit za unos svih Katedri , Smerova ,Predmeta i njihovih relacija radi lepse i preciznije generisane aplikacije i podataka unutar nje:

INSERT INTO Katedre (Naziv) VALUES 
('Računarstvo i automatika'),
('Softversko inženjerstvo'),
('Elektronika'),
('Industrijsko inženjerstvo i menadžment'),
('Telekomunikacije i obrada signala');

INSERT INTO Smerovi (Naziv) VALUES
('Računarsko inženjerstvo'),
('Automatika i elektronika'),
('Softverski sistemi'),
('Robotika'),
('Ugrađeni sistemi'),
('Softversko inženjerstvo'),
('Informacioni sistemi'),
('Programiranje igara'),
('Veb programiranje'),
('Računarska grafika'),
('Elektronika'),
('Mikroelektronika'),
('Digitalni sistemi'),
('Mikroprocesorski sistemi'),
('Elektronska merenja'),
('Industrijsko inženjerstvo'),
('Menadžment u inženjerstvu'),
('Organizacija rada'),
('Logistika'),
('Kvalitet i standardizacija'),
('Telekomunikacije'),
('Obrada signala'),
('Bežične komunikacije'),
('Mobilne mreže'),
('Internet stvari (IoT)');

INSERT INTO Predmeti (Naziv, BrojEspb) VALUES
('Matematika 1', 8),
('Osnovi programiranja', 8),
('Algoritmi i strukture podataka', 6),
('Baze podataka', 6),
('Operativni sistemi', 6),
('Računarske mreže', 6),
('Elektronika 1', 5),
('Digitalna logika', 5),
('Objektno orijentisano programiranje', 5),
('Softversko inženjerstvo', 5);

INSERT INTO SmerKatedra (KatedreId, SmeroviId) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), (1, 9),
(2, 3), (2, 6), (2, 7), (2, 8), (2, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
(5, 21), (5, 22), (5, 23), (5, 24), (5, 25);

INSERT INTO PredmetSmer (PredmetiId, SmeroviId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(1, 6), (2, 6), (3, 6), (4, 6), (5, 6),
(6, 6), (7, 6), (8, 6), (9, 6), (10, 6),
(2, 3), (3, 3), (4, 3), (9, 3), (10, 3),
(3, 8), (4, 8), (5, 8), (9, 8), (10, 8),
(4, 9), (5, 9), (6, 9), (9, 9), (10, 9),
(6, 11), (7, 11), (8, 11), (9, 11), (10, 11),
(5, 21), (6, 21), (7, 21), (9, 21), (10, 21);








  

  
  
