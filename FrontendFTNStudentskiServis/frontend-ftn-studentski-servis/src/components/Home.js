import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUniversity, FaPhoneAlt, FaChalkboardTeacher, FaMicroscope, FaBookOpen, FaGraduationCap, FaBullhorn } from "react-icons/fa";

const Home = () => {
  return (
    <motion.div
      className="container-fluid"
      style={{
        background: "linear-gradient(to bottom, #f0f4f8 0%, #d9e4ea 100%)",
        padding: "0",
        minHeight: "100vh",
        marginTop: 0, // Dodato da ukloni razmak između Navbar-a i sadržaja
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero sekcija */}
      <div
        className="text-center py-5"
        style={{
          background: "linear-gradient(135deg, #005f73 0%, #2c8b94 100%)",
          color: "white",
          borderRadius: "0 0 30px 30px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <motion.img
          src="/FTNLOGO.jpg"
          alt="FTN Logo"
          style={{
            width: "120px",
            marginBottom: "20px",
            borderRadius: "50%", // Logo u obliku kruga
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        />
        <h1 className="mb-3" style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
          Dobrodošli na Studentski servis Fakulteta tehničkih nauka
        </h1>
        <p className="lead" style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.2rem" }}>
          Vaša centralna platforma za sve akademske potrebe – od prijava ispita do fakultetskih informacija.
        </p>
      </div>

      {/* Ostali delovi ostaju isti */}
      {/* Kartice za brze linkove */}
      <div className="container py-5">
        <div className="row justify-content-center g-4">
          <motion.div className="col-md-5" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <div className="card shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-body text-center p-4">
                <FaUniversity size={40} color="#005f73" />
                <h5 className="card-title mt-3" style={{ color: "#005f73", fontWeight: "bold" }}>
                  Fakultetske informacije
                </h5>
                <p className="card-text">Pristup katedrama, smerovima i predmetima.</p>
                <Link to="/fakultetske-informacije">
                  <motion.button
                    className="btn"
                    style={{
                      backgroundColor: "#005f73",
                      color: "white",
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                    whileHover={{ backgroundColor: "#008cba", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Otvori
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
          <motion.div className="col-md-5" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <div className="card shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-body text-center p-4">
                <FaPhoneAlt size={40} color="#005f73" />
                <h5 className="card-title mt-3" style={{ color: "#005f73", fontWeight: "bold" }}>
                  Kontakt
                </h5>
                <p className="card-text">Kontaktirajte administraciju ili podršku.</p>
                <a href="https://ftn.uns.ac.rs/kontakt" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="btn"
                    style={{
                      backgroundColor: "#005f73",
                      color: "white",
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                    whileHover={{ backgroundColor: "#008cba", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Otvori
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ostatak koda ostaje nepromenjen */}
      {/* Sekcije sa slikama */}
      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h3 style={{ color: "#005f73", fontWeight: "bold" }}>O Fakultetu</h3>
            <p style={{ textAlign: "justify", color: "#333", fontSize: "1.1rem" }}>
              Fakultet tehničkih nauka u Novom Sadu je lider u tehničkom obrazovanju, nudeći programe u inženjerstvu i tehnologiji.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <motion.img
              src="/FTNSLIKAPOCETNA.jpg"
              alt="Fakultet"
              className="img-fluid rounded shadow-lg"
              style={{ maxWidth: "100%", borderRadius: "15px" }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
        </div>

        <div className="row align-items-center mb-5">
          <div className="col-md-6 text-center order-md-1 order-2">
            <motion.img
              src="/ftnn.jpg"
              alt="Panorama"
              className="img-fluid rounded shadow-lg"
              style={{ maxWidth: "100%", borderRadius: "15px" }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
          <div className="col-md-6 order-md-2 order-1">
            <h3 style={{ color: "#005f73", fontWeight: "bold" }}>Savremeni uslovi</h3>
            <p style={{ textAlign: "justify", color: "#333", fontSize: "1.1rem" }}>
              FTN nudi vrhunske laboratorije i moderne učionice za optimalno iskustvo učenja.
            </p>
          </div>
        </div>
      </div>

      {/* Novi Sad sekcija */}
      <div className="position-relative my-5">
        <motion.img
          src="/NS2.jpeg"
          alt="Novi Sad"
          className="img-fluid w-100"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <motion.div
          className="position-absolute text-center w-75 p-4"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            color: "white",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Novi Sad</h2>
          <p style={{ fontSize: "1.2rem", maxWidth: "90%", margin: "0 auto" }}>
            Grad kulture, obrazovanja i inovacija – idealno mesto za studente.
          </p>
        </motion.div>
      </div>

      {/* Fakultet u brojkama */}
      <div className="container py-5">
        <h2 className="text-center" style={{ color: "#005f73", fontWeight: "bold", marginBottom: "40px" }}>
          Fakultet u brojkama
        </h2>
        <div className="row g-4 justify-content-center">
          {[
            { icon: FaUniversity, title: "Studenata", value: "17 000+" },
            { icon: FaChalkboardTeacher, title: "Zaposlenih", value: "1 228+" },
            { icon: FaMicroscope, title: "Laboratorija", value: "126" },
            { icon: FaBookOpen, title: "Bibliotečkih jedinica", value: "195.522+" },
            { icon: FaUniversity, title: "Departmana", value: "13" },
          ].map((item, index) => (
            <motion.div key={index} className="col-md-4 col-lg-2" whileHover={{ scale: 1.05 }}>
              <div
                className="card text-center shadow-sm border-0 p-4 d-flex flex-column justify-content-between"
                style={{
                  borderRadius: "12px",
                  height: "200px",
                  minWidth: "150px",
                }}
              >
                <div>
                  <item.icon size={50} color="#005f73" />
                  <h5 className="mt-3" style={{ fontWeight: "bold", color: "#005f73" }}>{item.title}</h5>
                </div>
                <h3 style={{ fontWeight: "bold", color: "#333", marginBottom: "0" }}>{item.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Najnovije vesti */}
      <div className="container py-5">
        <h2 className="text-center" style={{ color: "#005f73", fontWeight: "bold", marginBottom: "40px" }}>
          Najnovije vesti
        </h2>
        <div className="row g-4">
          {[
            { title: "Dan otvorenih vrata 2025", date: "15. mart 2025", desc: "Saznajte više o studijskim programima." },
            { title: "Novi laboratorijski centar", date: "10. februar 2025", desc: "Otvoren novi centar za istraživanje." },
            { title: "Studentska konferencija", date: "20. april 2025", desc: "Prijave su u toku!" },
          ].map((news, index) => (
            <motion.div key={index} className="col-md-4" whileHover={{ scale: 1.05 }}>
              <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "15px" }}>
                <div className="card-body">
                  <FaBullhorn size={30} color="#005f73" />
                  <h5 className="card-title mt-3" style={{ color: "#005f73", fontWeight: "bold" }}>{news.title}</h5>
                  <p className="card-text text-muted">{news.date}</p>
                  <p>{news.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Budući studenti */}
      <div className="container py-5">
        <h2 className="text-center" style={{ color: "#005f73", fontWeight: "bold", marginBottom: "40px" }}>
          Budući studenti
        </h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <h3 style={{ color: "#005f73", fontWeight: "bold" }}>Započni svoje putovanje</h3>
            <p style={{ textAlign: "justify", color: "#333", fontSize: "1.1rem" }}>
              Saznaj više o upisu, studijskim programima i mogućnostima koje nudi FTN.
            </p>
            <div className="text-center">
              <a
                href="https://ftn.uns.ac.rs/nastavno-naucno-vece-fakulteta-tehnickih-nauka-univerziteta-u-novom-sadu-usvojilo-je-na-50-sednici-odrzanoj-24-04-2024-pravila-za-upis-u-skolskoj-2024-25-godini/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  className="btn mt-3"
                  style={{
                    backgroundColor: "#005f73",
                    color: "white",
                    padding: "12px 30px",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                  }}
                  whileHover={{ backgroundColor: "#008cba", scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaGraduationCap style={{ marginRight: "8px" }} /> Saznaj više
                </motion.button>
              </a>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <motion.img
              src="/studentiftn2.jpg"
              alt="Studenti FTN"
              className="img-fluid rounded shadow-lg"
              style={{ maxWidth: "100%", borderRadius: "15px" }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
        </div>
      </div>

      {/* Galerija objekata */}
      <div className="container py-5">
        <h2 className="text-center" style={{ color: "#005f73", fontWeight: "bold", marginBottom: "40px" }}>
          Naši objekti
        </h2>
        <div className="row g-4">
          {["/kampus1.jpg", "/kampus4.jpg", "/kampus3.2.jpeg"].map((img, index) => (
            <motion.div key={index} className="col-md-4" whileHover={{ scale: 1.05 }}>
              <img
                src={img}
                alt={`Kampus ${index + 1}`}
                className="img-fluid rounded shadow-lg"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Poziv na akciju */}
      <div className="container py-5 text-center" style={{ backgroundColor: "#005f73", color: "white", borderRadius: "20px" }}>
        <h2 style={{ fontWeight: "bold" }}>Pridruži se FTN zajednici</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "20px auto" }}>
          Budi deo inovativnog obrazovanja i započni svoju karijeru sa nama!
        </p>
        <a href="https://ftn.uns.ac.rs/" target="_blank" rel="noopener noreferrer">
          <motion.button
            className="btn"
            style={{
              backgroundColor: "white",
              color: "#005f73",
              padding: "12px 30px",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            whileHover={{ backgroundColor: "#e6f0f5", scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaGraduationCap style={{ marginRight: "8px" }} /> Saznaj više
          </motion.button>
        </a>
      </div>
    </motion.div>
  );
};

export default Home;