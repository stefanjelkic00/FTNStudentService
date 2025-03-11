import React, { useEffect, useState } from "react";
import { fetchPredmeti } from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

const Predmeti = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredmeti()
      .then((response) => setPredmeti(response.data))
      .catch(() => toast.error("Greška pri učitavanju predmeta."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div 
      className="container mt-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="mb-4 text-center" style={{ color: "#f0ad4e", fontWeight: "bold" }}>
        <FaBookOpen style={{ marginRight: "8px" }} /> Predmeti
      </h2>
      {loading ? (
        <p className="text-center">Učitavanje...</p>
      ) : (
        <ul className="list-group">
          {predmeti.map((predmet) => (
            <motion.li 
              key={predmet.id} 
              className="list-group-item"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {predmet.naziv} - <small>{predmet.katedraNaziv}</small>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Predmeti;
