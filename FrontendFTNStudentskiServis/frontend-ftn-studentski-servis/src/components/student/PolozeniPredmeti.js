import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../axios";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const PolozeniPredmeti = () => {
  const [polozeniPredmeti, setPolozeniPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolozeni = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) {
          toast.error("❌ Greška: student ID nije pronađen.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/studenti-predmeti/polozeni-predmeti/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.$values && Array.isArray(response.data.$values)) {
          setPolozeniPredmeti(response.data.$values);
        } else {
          setPolozeniPredmeti([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška pri učitavanju položenih predmeta:", error.response?.data || error.message);
        toast.error("❌ Greška prilikom učitavanja položenih predmeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolozeni();
  }, []);

  // Izračunavanje ukupnog broja ESPB bodova
  const ukupnoEspb = polozeniPredmeti.reduce((sum, predmet) => {
    return sum + (predmet.brojEspb || 0); // Ako brojEspb nije definisan, koristi 0
  }, 0);

  // Izračunavanje proseka ocena
  const prosecnaOcena = polozeniPredmeti.length > 0
    ? polozeniPredmeti.reduce((sum, predmet) => {
        return sum + (predmet.ocena || 0); // Ako ocena nije definisana, koristi 0
      }, 0) / polozeniPredmeti.length
    : 0;

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
          <FaClipboardList className="me-2" /> Položeni predmeti
        </motion.h2>
    
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Učitavanje...</span>
            </div>
          </div>
        ) : polozeniPredmeti.length === 0 ? (
          <p className="text-center text-muted">Nemate položenih predmeta.</p>
        ) : (
          <div className="container">
            <motion.div
              className="card shadow-lg border-0 p-4"
              style={{ borderRadius: "15px" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4 text-center">
                <p style={{ color: "#005f73", fontWeight: "bold", fontSize: "1.2rem" }}>
                  Ukupan broj ESPB: <span style={{ color: "#333" }}>{ukupnoEspb}</span>
                </p>
                <p style={{ color: "#005f73", fontWeight: "bold", fontSize: "1.2rem" }}>
                  Prosek ocena: <span style={{ color: "#333" }}>{prosecnaOcena.toFixed(2)}</span>
                </p>
              </div>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Naziv predmeta</th>
                    <th scope="col">ESPB</th>  {/* ✅ Dodata kolona ESPB */}
                    <th scope="col">Ocena</th>
                  </tr>
                </thead>
                <tbody>
                  {polozeniPredmeti.map((predmet, index) => (
                    <motion.tr
                      key={predmet.predmetId || index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>{index + 1}</td>
                      <td>{predmet.naziv || "Nepoznati predmet"}</td>
                      <td>{predmet.brojEspb !== undefined ? predmet.brojEspb : "/"}</td>  {/* ✅ Prikaz ESPB */}
                      <td>{predmet.ocena !== undefined ? predmet.ocena : "/"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        )}
      </motion.div>
    );
    
};

export default PolozeniPredmeti;