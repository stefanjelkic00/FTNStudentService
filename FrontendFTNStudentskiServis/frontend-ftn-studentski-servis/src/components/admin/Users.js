import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

const Users = () => {
  const [profesori, setProfesori] = useState([]);
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profesoriResponse, studentiResponse] = await Promise.all([
        axiosInstance.get("/profesor"),
        axiosInstance.get("/student"),
      ]);
      setProfesori(profesoriResponse.data.$values || []);
      setStudenti(studentiResponse.data.$values || []);
    } catch (error) {
      toast.error("Greška pri učitavanju korisnika.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete?")) return;
    try {
      await axiosInstance.delete(`/${type}/${id}`);
      toast.success("Korisnik obrisan.");
      fetchData();
    } catch (error) {
      toast.error("Greška pri brisanju korisnika.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(90deg, #003d4d 0%, #005f73 50%, #2c8b94 100%)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-20%",
          width: "140%",
          height: "200%",
          background: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"%3E%3Cpath fill=\"rgba(255,255,255,0.05)\" fill-opacity=\"1\" d=\"M0,192L48,186.7C96,181,192,171,288,160C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\"%3E%3C/path%3E%3C/svg%3E')",
          backgroundSize: "cover",
          opacity: 0.5,
          transform: "rotate(-10deg)",
          zIndex: 0,
        }}
      />

      <motion.div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          position: "relative",
          zIndex: 1,
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: "#005f73", fontWeight: "bold" }}>
            Korisnici - Admin
          </h2>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Učitavanje...</span>
              </div>
            </div>
          ) : (
            <>
              <h3 style={{ color: "#005f73", fontWeight: "bold", marginBottom: "15px" }}>Profesori</h3>
              <ul className="list-group list-group-flush mb-4">
                {profesori.map((prof) => (
                  <motion.li
                    key={prof.id}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {prof.ime} {prof.prezime}
                    <motion.button
                      className="btn"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                      }}
                      onClick={() => handleDelete("profesor", prof.id)}
                      whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.li>
                ))}
              </ul>

              <h3 style={{ color: "#005f73", fontWeight: "bold", marginBottom: "15px" }}>Studenti</h3>
              <ul className="list-group list-group-flush">
                {studenti.map((stud) => (
                  <motion.li
                    key={stud.id}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stud.ime} {stud.prezime}
                    <motion.button
                      className="btn"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                      }}
                      onClick={() => handleDelete("student", stud.id)}
                      whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </>
          )}
        </div>
      </motion.div>

      <style>{`
        .card {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Users;