import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const MojiZahtevi = () => {
  const [zahtevi, setZahtevi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZahtevi = async () => {
      try {
        const response = await axiosInstance.get("/profesor/moji-zahtevi");
        if (response.data?.$values && Array.isArray(response.data.$values)) {
          setZahtevi(response.data.$values);
        } else {
          setZahtevi([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška prilikom učitavanja zahteva:", error.response?.data || error.message);
        toast.error("❌ Greška prilikom učitavanja zahteva.");
      } finally {
        setLoading(false);
      }
    };

    fetchZahtevi();
  }, []);

  const otkaziZahtev = async (predmetId) => {
    try {
      await axiosInstance.delete(`/profesor/otkazi-zahtev/${predmetId}`);
      toast.success("✅ Zahtev je uspešno otkazan.");
      setZahtevi((prev) => prev.filter((z) => z.predmetId !== predmetId));
    } catch (error) {
      console.error("❌ Greška prilikom otkazivanja zahteva:", error.response?.data || error.message);
      toast.error("❌ Greška prilikom otkazivanja zahteva.");
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
        <FaClipboardList className="me-2" /> Moji zahtevi
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : zahtevi.length === 0 ? (
        <p className="text-center text-muted">Nema podnetih zahteva.</p>
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
              {zahtevi.map((z, index) => (
                <motion.li
                  key={z.predmetId || index}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <strong>{z.nazivPredmeta || "Nepoznati predmet"}</strong>
                  </div>
                  <div>
                    <span
                      className={`badge ${z.odobren ? "bg-success" : "bg-warning"} me-3`}
                      style={{ minWidth: "100px", textAlign: "center" }}
                    >
                      {z.odobren ? "Odobren" : "Na čekanju"}
                    </span>
                    {!z.odobren && z.predmetId && (
                      <motion.button
                        className="btn"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          borderRadius: "8px",
                          padding: "6px 12px",
                        }}
                        onClick={() => otkaziZahtev(z.predmetId)}
                        whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                        transition={{ duration: 0.3 }}
                      >
                        Otkaži
                      </motion.button>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MojiZahtevi;