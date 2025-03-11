import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaClipboardCheck } from "react-icons/fa";

const PrijavaIspita = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrijava, setLoadingPrijava] = useState(false);
  const [prijavaInProgress, setPrijavaInProgress] = useState(null);

  useEffect(() => {
    const fetchPredmeti = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("❌ Greška: Student ID nije pronađen.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/prijavaStudenta/predmeti-za-prijavu`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.$values && Array.isArray(response.data.$values)) {
          setPredmeti(response.data.$values);
        } else {
          setPredmeti([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška pri učitavanju predmeta za prijavu:", error.response?.data || error.message);
        toast.error("❌ Greška pri učitavanju predmeta za prijavu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredmeti();
  }, []);

  const prijaviIspit = async (predmetId) => {
    setLoadingPrijava(true);
    setPrijavaInProgress(predmetId);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("❌ Greška: Student ID nije pronađen.");
        return;
      }

      const prijavaData = {
        studentId: Number(user.id),
        predmetId: Number(predmetId),
      };

      await axiosInstance.post("/prijavaStudenta/prijava-ispita", prijavaData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Predmet uspešno prijavljen!");
      setPredmeti((prev) => prev.filter((p) => p.id !== predmetId));
    } catch (error) {
      console.error("❌ Greška pri prijavi ispita:", error.response?.data || error.message);
      toast.error("❌ Greška pri prijavi ispita.");
    } finally {
      setLoadingPrijava(false);
      setPrijavaInProgress(null);
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
        <FaClipboardCheck className="me-2" /> Prijava ispita
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : predmeti.length === 0 ? (
        <p className="text-center text-muted">Nemate predmete za prijavu.</p>
      ) : (
        <div className="container">
          <motion.div
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: "15px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center mb-4">
              <strong>Ukupno dostupnih ispita:</strong> {predmeti.length}
            </p>
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Naziv predmeta</th>
                  <th scope="col">Akcija</th>
                </tr>
              </thead>
              <tbody>
                {predmeti.map((predmet, index) => (
                  <motion.tr
                    key={predmet.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>{index + 1}</td>
                    <td>{predmet.naziv}</td>
                    <td>
                      <motion.button
                        className="btn"
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          borderRadius: "8px",
                          padding: "6px 12px",
                        }}
                        onClick={() => prijaviIspit(predmet.id)}
                        disabled={loadingPrijava && prijavaInProgress === predmet.id}
                        whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                        transition={{ duration: 0.3 }}
                      >
                        {loadingPrijava && prijavaInProgress === predmet.id ? "Prijava..." : "Prijavi"}
                      </motion.button>
                    </td>
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

export default PrijavaIspita;