import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";

const KatedraDetalji = () => {
  const { id } = useParams();
  const [katedra, setKatedra] = useState(null);
  const [smerovi, setSmerovi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKatedraDetails = async () => {
      try {
        const response = await axiosInstance.get(`/katedra/${id}`);
        setKatedra(response.data);
        setSmerovi(response.data.smerovi?.$values || []);
      } catch (error) {
        console.error("Greška pri učitavanju katedre:", error);
        toast.error("Greška pri učitavanju podataka o katedri.");
      } finally {
        setLoading(false);
      }
    };
    fetchKatedraDetails();
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
      ) : !katedra ? (
        <p className="text-center mt-5" style={{ color: "#005f73" }}>
          Katedra nije pronađena.
        </p>
      ) : (
        <div className="container">
          <motion.h2
            className="mb-5 text-center"
            style={{ color: "#005f73", fontWeight: "bold", fontSize: "2.5rem" }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaBuilding className="me-2" /> Katedra: {katedra.naziv}
          </motion.h2>

          <motion.div
            className="card shadow-lg border-0 p-4"
            style={{ borderRadius: "15px" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 style={{ color: "#005f73", fontWeight: "bold" }}>Smerovi na ovoj katedri</h4>
            {smerovi.length === 0 ? (
              <p className="text-muted">Nema dostupnih smerova za ovu katedru.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {smerovi.map((smer, index) => (
                  <motion.li
                    key={index}
                    className="list-group-item border-0 py-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {smer}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default KatedraDetalji;