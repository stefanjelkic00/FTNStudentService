import React, { useEffect, useState } from "react";
import { fetchSmerovi } from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

const Smerovi = () => {
  const [smerovi, setSmerovi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSmerovi()
      .then((response) => setSmerovi(response.data))
      .catch(() => toast.error("Greška pri učitavanju smerova."))
      .finally(() => setLoading(false));
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
        <FaGraduationCap className="me-2" /> Smerovi
      </motion.h2>

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
            <ul className="list-group list-group-flush">
              {smerovi.map((smer) => (
                <motion.li
                  key={smer.id}
                  className="list-group-item border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={`/smer/${smer.id}`}
                    style={{ textDecoration: "none", color: "#005f73", fontWeight: "bold" }}
                  >
                    {smer.naziv}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Smerovi;