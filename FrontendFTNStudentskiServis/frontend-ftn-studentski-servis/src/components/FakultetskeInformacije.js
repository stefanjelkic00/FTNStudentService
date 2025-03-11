import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../axios";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";

const FakultetskeInformacije = () => {
  const [katedre, setKatedre] = useState([]);
  const [smerovi, setSmerovi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [katedreRes, smeroviRes] = await Promise.all([
          axiosInstance.get("/katedra"),
          axiosInstance.get("/smer"),
        ]);

        setKatedre(katedreRes.data?.$values || katedreRes.data || []);
        setSmerovi(smeroviRes.data?.$values || smeroviRes.data || []);
      } catch (error) {
        console.error("❌ Greška pri učitavanju fakultetskih informacija:", error);
        toast.error("Greška pri učitavanju fakultetskih informacija.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      className="container-fluid py-5"
      style={{ background: "linear-gradient(to bottom, #f0f4f8 0%, #d9e4ea 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-center mb-5" style={{ color: "#005f73", fontWeight: "bold", fontSize: "2.5rem" }}>
        Fakultetske Informacije
      </h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row g-4">
            {/* Katedre */}
            <div className="col-md-6">
              <motion.div
                className="card shadow-lg border-0"
                style={{ borderRadius: "15px", overflow: "hidden" }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="card-body p-4">
                  <h4 className="text-center mb-4" style={{ color: "#005f73", fontWeight: "bold" }}>
                    <FaBuilding className="me-2" /> Katedre
                  </h4>
                  <ul className="list-group list-group-flush">
                    {(katedre || []).map((katedra) => (
                      <motion.li
                        key={katedra.id}
                        className="list-group-item border-0 py-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link
                          to={`/katedra/${katedra.id}`}
                          style={{ textDecoration: "none", color: "#005f73", fontWeight: "bold" }}
                        >
                          {katedra.naziv}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Smerovi */}
            <div className="col-md-6">
              <motion.div
                className="card shadow-lg border-0"
                style={{ borderRadius: "15px", overflow: "hidden" }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="card-body p-4">
                  <h4 className="text-center mb-4" style={{ color: "#005f73", fontWeight: "bold" }}>
                    <FaGraduationCap className="me-2" /> Smerovi
                  </h4>
                  <ul className="list-group list-group-flush">
                    {(smerovi || []).map((smer) => (
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
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FakultetskeInformacije;