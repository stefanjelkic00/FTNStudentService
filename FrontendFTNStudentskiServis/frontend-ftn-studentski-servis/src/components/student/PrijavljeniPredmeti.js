import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const PrijavljeniPredmeti = () => {
  const [prijavljeniPredmeti, setPrijavljeniPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrijavljeniPredmeti = async () => {
      try {
        const response = await axiosInstance.get("/prijavaStudenta/prijavljeni-predmeti", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.$values && Array.isArray(response.data.$values)) {
          setPrijavljeniPredmeti(response.data.$values);
        } else {
          setPrijavljeniPredmeti([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška pri učitavanju prijavljenih predmeta:", error.response?.data || error.message);
        toast.error("❌ Greška prilikom učitavanja prijavljenih predmeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrijavljeniPredmeti();
  }, []);

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
        <FaClipboardList className="me-2" /> Prijavljeni predmeti
      </motion.h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : prijavljeniPredmeti.length === 0 ? (
        <p className="text-center text-muted">Nema prijavljenih predmeta.</p>
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
              {prijavljeniPredmeti.map((predmet, index) => (
                <motion.li
                  key={predmet.id || index}
                  className="list-group-item border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {predmet.naziv || "Nepoznati predmet"}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PrijavljeniPredmeti;