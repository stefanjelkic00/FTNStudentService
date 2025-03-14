import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaClipboardCheck } from "react-icons/fa";

const OceneStudenata = () => {
  const [podaci, setPodaci] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOcenjeniStudenti = async () => {
      try {
        const response = await axiosInstance.get("/profesor/ocenjeni-studenti");
        if (response.data.$values) {
          const parsedData = response.data.$values.map((smerObj) => ({
            smer: smerObj.smer,
            predmeti: smerObj.predmeti?.$values
              ? smerObj.predmeti.$values.map((predmet) => ({
                  predmetId: predmet.predmetId,
                  naziv: predmet.naziv,
                  studenti: predmet.studenti?.$values || [],
                }))
              : [],
          }));
          setPodaci(parsedData);
        } else {
          toast.error("Neispravan format podataka sa servera.");
        }
      } catch (error) {
        toast.error("❌ Greška prilikom učitavanja ocenjenih studenata.");
        console.error("❌ Greška:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOcenjeniStudenti();
  }, []);

  const getBoxColor = (ocena) => {
    if (ocena === 6) return "bg-danger text-white";
    if (ocena >= 7 && ocena <= 8) return "bg-warning text-dark";
    if (ocena >= 9) return "bg-success text-white";
    return "bg-secondary text-white";
  };

  return (
    <motion.div
      className="container-fluid py-5"
      style={{ background: "linear-gradient(to bottom, #f0f4f8 0%, #d9e4ea 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="mb-5 text-center"
        style={{ color: "#005f73", fontWeight: "bold", fontSize: "2.5rem" }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaClipboardCheck className="me-2" /> Ocenjeni studenti
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : podaci.length === 0 ? (
        <p className="text-center text-muted">Nema ocenjenih studenata.</p>
      ) : (
        <div className="container">
          {podaci.map((smerObj, idx) => (
            <motion.div
              key={idx}
              className="mb-5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <h4 className="fw-bold mb-3" style={{ color: "#005f73" }}>
                Smer: {smerObj.smer}
              </h4>
              {Array.isArray(smerObj.predmeti) && smerObj.predmeti.length > 0 ? (
                smerObj.predmeti.map((predmet) => (
                  <motion.div
                    key={predmet.predmetId}
                    className="card shadow-lg border-0 mb-3"
                    style={{ borderRadius: "15px" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="card-header fw-bold"
                      style={{ backgroundColor: "#005f73", color: "white", borderRadius: "15px 15px 0 0" }}
                    >
                      {predmet.naziv}
                    </div>
                    <div className="card-body">
                      {predmet.studenti.length > 0 ? (
                        <ul className="list-group list-group-flush">
                          {predmet.studenti.map((student) => (
                            <motion.li
                              key={`${student.studentId}-${predmet.predmetId}`}
                              className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <strong>
                                {student.ime} {student.prezime} (Index: {student.index})
                              </strong>
                              <span
                                className={`d-flex justify-content-center align-items-center ${getBoxColor(student.ocena)}`}
                                style={{
                                  minWidth: "100px",
                                  height: "40px",
                                  borderRadius: "10px",
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                }}
                              >
                                Ocena: {student.ocena}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">Nema ocenjenih studenata za ovaj predmet.</p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted">Nema dostupnih predmeta.</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OceneStudenata;