import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaChalkboardTeacher } from "react-icons/fa";

const PredmetiProfesora = () => {
  const [podaci, setPodaci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ocene, setOcene] = useState({});

  useEffect(() => {
    const fetchPredmeti = async () => {
      try {
        const response = await axiosInstance.get("/profesor/predmeti-sa-prijavama");
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
        toast.error("Greška prilikom učitavanja predmeta.");
        console.error("❌ Greška:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredmeti();
  }, []);

  const handleOceni = async (studentId, predmetId) => {
    const ocena = parseInt(ocene[`${studentId}-${predmetId}`], 10);
    if (isNaN(ocena) || ocena < 5 || ocena > 10) {
      toast.error("Molimo unesite ocenu između 5 i 10.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/profesor/oceni-studenta",
        { studentId, predmetId, ocena },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success("✅ Ocena uspešno uneta!");
        setPodaci((prevPodaci) =>
          prevPodaci.map((smer) => ({
            ...smer,
            predmeti: smer.predmeti.map((predmet) => {
              if (predmet.predmetId === predmetId) {
                return {
                  ...predmet,
                  studenti: predmet.studenti.filter((s) => s.studentId !== studentId),
                };
              }
              return predmet;
            }),
          }))
        );
      } else {
        toast.error("⚠️ Neočekivani odgovor sa servera.");
      }
    } catch (error) {
      console.error("❌ Greška prilikom unosa ocene:", error.response?.data || error.message);
      toast.error("❌ Greška prilikom unosa ocene.");
    }
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
        <FaChalkboardTeacher className="me-2" /> Moji predmeti i prijavljeni studenti
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : podaci.length === 0 ? (
        <p className="text-center text-muted">Nema dostupnih podataka.</p>
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
                              <div className="d-flex align-items-center">
                              <select
                                    className="form-select me-2"
                                    style={{ width: "180px", borderRadius: "8px" }}  // ✅ Povećana širina sa 150px na 180px
                                    value={ocene[`${student.studentId}-${predmet.predmetId}`] || ""}
                                    onChange={(e) =>
                                      setOcene({
                                        ...ocene,
                                        [`${student.studentId}-${predmet.predmetId}`]: e.target.value,
                                      })
                                    }
                                >

                                  <option value="">Izaberite ocenu</option>
                                  <option value="5">5 - Nije položio</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                  <option value="10">10</option>
                                </select>
                                <motion.button
                                  className="btn"
                                  style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                  }}
                                  onClick={() => handleOceni(student.studentId, predmet.predmetId)}
                                  whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                                  transition={{ duration: 0.3 }}
                                >
                                  Oceni
                                </motion.button>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">Nema prijavljenih studenata za ocenjivanje.</p>
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

export default PredmetiProfesora;