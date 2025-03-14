import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaChalkboardTeacher } from "react-icons/fa";

const ApliciranjePredmeta = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredmeti = async () => {
      try {
        const response = await axiosInstance.get(`/profesor/predmeti-za-apliciranje`);
        if (response.data?.$values && Array.isArray(response.data.$values)) {
          const extractedPredmeti = response.data.$values.flatMap((smer) =>
            smer.predmeti?.$values
              ? smer.predmeti.$values.map((predmet) => ({
                  predmetId: Number(predmet.predmetId),
                  naziv: predmet.naziv,
                  smer: smer.smer,
                }))
              : []
          );
          setPredmeti(extractedPredmeti);
        } else {
          setPredmeti([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška prilikom učitavanja predmeta:", error.response?.data || error.message);
        toast.error("❌ Greška prilikom učitavanja predmeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredmeti();
  }, []);

  const aplicirajNaPredmet = async (predmetId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Greška: Nema tokena za autentifikaciju.");
        return;
      }

      if (!Number.isInteger(predmetId)) {
        toast.error("⚠️ Nevažeći predmet ID.");
        return;
      }

      const response = await axiosInstance.post(
        `/profesor/apliciraj`,
        JSON.stringify(predmetId),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Uspešno ste aplicirali za predmet.");
        setPredmeti((prev) => prev.filter((p) => p.predmetId !== predmetId));
      } else {
        toast.error("⚠️ Neočekivan odgovor servera.");
      }
    } catch (error) {
      console.error("❌ Greška prilikom apliciranja:", error.response?.data || error.message);
      toast.error(`❌ Greška prilikom apliciranja: ${JSON.stringify(error.response?.data?.errors || "Nepoznata greška")}`);
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
        <FaChalkboardTeacher className="me-2" /> Predmeti za apliciranje
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : predmeti.length === 0 ? (
        <p className="text-center text-muted">Trenutno nema dostupnih predmeta za apliciranje.</p>
      ) : (
        <div className="container">
          <motion.div
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: "15px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ul className="list-group list-group-flush">
              {predmeti.map((p, index) => (
                <motion.li
                  key={p.predmetId || index}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <strong>{p.naziv || "Nepoznati predmet"}</strong>
                    <br />
                    <small className="text-muted">Smer: {p.smer}</small>
                  </div>
                  <motion.button
                    className="btn"
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      borderRadius: "8px",
                      padding: "6px 12px",
                    }}
                    onClick={() => aplicirajNaPredmet(p.predmetId)}
                    whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                    transition={{ duration: 0.3 }}
                  >
                    Apliciraj
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ApliciranjePredmeta;