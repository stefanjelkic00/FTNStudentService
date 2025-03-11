import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const SmerDetalji = () => {
  const { id } = useParams();
  const [smer, setSmer] = useState(null);
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSmerDetalji = async () => {
      try {
        const response = await axiosInstance.get(`/smer/${id}`);
        setSmer(response.data);
        setPredmeti(response.data.predmeti?.$values || []);
      } catch (error) {
        console.error("Greška pri učitavanju smerova:", error);
        toast.error("Greška pri učitavanju podataka o smeru.");
      } finally {
        setLoading(false);
      }
    };
    fetchSmerDetalji();
  }, [id]);

  return (
    <motion.div
      className="container-fluid py-5"
      style={{ background: "linear-gradient(to bottom, #f0f4f8 0%, #d9e4ea 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : !smer ? (
        <p className="text-center mt-5" style={{ color: "#005f73" }}>
          Nema podataka za ovaj smer.
        </p>
      ) : (
        <div className="container">
          <motion.h2
            className="text-center mb-5"
            style={{ color: "#005f73", fontWeight: "bold", fontSize: "2.5rem" }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaGraduationCap className="me-2" /> Smer: {smer.naziv}
          </motion.h2>

          <motion.div
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: "15px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 style={{ color: "#005f73", fontWeight: "bold" }}>Predmeti</h4>
            {predmeti.length > 0 ? (
              <ul className="list-group list-group-flush">
                {predmeti.map((predmet) => (
                  <motion.li
                    key={predmet.id}
                    className="list-group-item border-0 py-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <strong>{predmet.naziv}</strong>
                    <p className="mt-1 mb-0 text-muted">
                      <small>
                        Profesor:{" "}
                        {predmet.profesori && predmet.profesori.$values?.length > 0
                          ? predmet.profesori.$values.map((prof) => `${prof.ime} ${prof.prezime}`).join(", ")
                          : "Nepoznato"}
                      </small>
                    </p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Nema predmeta povezanih sa ovim smerom.</p>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SmerDetalji;