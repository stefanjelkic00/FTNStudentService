import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";

const SviPredmeti = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [smer, setSmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredmeti = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("❌ Greška: student ID nije pronađen.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/studenti-predmeti/svi-predmeti/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setSmer(response.data.smer || "Smer nije pronađen");
        if (response.data.predmeti?.$values && Array.isArray(response.data.predmeti.$values)) {
          setPredmeti(response.data.predmeti.$values);
        } else {
          setPredmeti([]);
          toast.error("⚠️ Format podataka nije validan.");
        }
      } catch (error) {
        console.error("❌ Greška pri učitavanju predmeta:", error.response?.data || error.message);
        toast.error("❌ Greška pri učitavanju predmeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredmeti();
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
        className="mb-3 text-center"
        style={{ color: "#005f73", fontWeight: "bold", fontSize: "2.5rem" }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaBook className="me-2" /> {smer}
      </motion.h2>
      <motion.h3
        className="mb-5 text-center"
        style={{ color: "#005f73", fontWeight: "normal", fontSize: "1.8rem" }}
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Svi Predmeti
      </motion.h3>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <motion.div
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: "15px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Naziv predmeta</th>
                  <th scope="col">ESPB</th>
                </tr>
              </thead>
              <tbody>
                {predmeti.length > 0 ? (
                  predmeti.map((predmet, index) => (
                    <motion.tr
                      key={predmet.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>{index + 1}</td>
                      <td>{predmet.naziv}</td>
                      <td>{predmet.brojEspb ? predmet.brojEspb : "/"}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      Nema dostupnih predmeta.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SviPredmeti;