import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaEdit, FaPlusCircle, FaTimes } from "react-icons/fa";

const SmeroviAdmin = () => {
  const [smerovi, setSmerovi] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [newSmer, setNewSmer] = useState("");
  const [selectedSmerForEdit, setSelectedSmerForEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSmerForPredmeti, setSelectedSmerForPredmeti] = useState(null);
  const [availablePredmeti, setAvailablePredmeti] = useState([]);
  const [selectedPredmeti, setSelectedPredmeti] = useState([]);
  const [showPredmetiModal, setShowPredmetiModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editNaziv, setEditNaziv] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [smeroviResponse, predmetiResponse] = await Promise.all([
        axiosInstance.get("/smer"),
        axiosInstance.get("/predmet"),
      ]);
      setSmerovi(smeroviResponse.data.$values || []);
      setPredmeti(predmetiResponse.data.$values || []);
    } catch (error) {
      toast.error("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSmer = async () => {
    if (!newSmer.trim()) {
      toast.error("Naziv ne može biti prazan.");
      return;
    }
    try {
      const response = await axiosInstance.post("/smer", { naziv: newSmer });
      toast.success("Smer uspešno dodat.");
      setNewSmer("");
      setSmerovi((prev) => [...prev, response.data]);
    } catch (error) {
      toast.error("Greška pri unosu smera.");
    }
  };

  const handleEditSmer = async (id) => {
    if (!editNaziv.trim()) {
      toast.error("Naziv ne može biti prazan.");
      return;
    }
    try {
      await axiosInstance.put(`/smer/${id}`, { naziv: editNaziv });
      toast.success("Smer uspešno izmenjen.");
      setSmerovi((prev) => prev.map((smer) => (smer.id === id ? { ...smer, naziv: editNaziv } : smer)));
      setSelectedSmerForEdit(null);
      setIsEditing(false);
      setEditNaziv("");
    } catch (error) {
      toast.error("Greška pri izmeni smera.");
    }
  };

  const openPredmetiModal = (smer) => {
    setSelectedSmerForPredmeti(smer);
    setSelectedPredmeti([]);
    setShowPredmetiModal(true);
    setSelectedSmerForEdit(null);
    setIsEditing(false);

    const predmetiSmera = smer.predmeti && Array.isArray(smer.predmeti) ? smer.predmeti.map((p) => p.id) : [];
    const dostupniPredmeti = predmeti.filter((predmet) => !predmetiSmera.includes(predmet.id));
    setAvailablePredmeti(dostupniPredmeti);
  };

  const handleTogglePredmet = (predmetId) => {
    setSelectedPredmeti((prev) =>
      prev.includes(predmetId) ? prev.filter((id) => id !== predmetId) : [...prev, predmetId]
    );
  };

  const handleDodajPredmete = async () => {
    if (!selectedSmerForPredmeti || selectedPredmeti.length === 0) {
      toast.error("Izaberite bar jedan predmet.");
      return;
    }
    try {
      const predmetiZaSlanje = { predmetIds: selectedPredmeti };
      const response = await axiosInstance.put(
        `/smer/${selectedSmerForPredmeti.id}/dodaj-predmete`,
        predmetiZaSlanje,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Predmeti uspešno dodati smeru.");
      await fetchData();
      setShowPredmetiModal(false);
      setSelectedPredmeti([]);
      setSelectedSmerForPredmeti(null);
      setAvailablePredmeti([]);
      setSelectedSmerForEdit(null);
      setIsEditing(false);
      setEditNaziv("");
    } catch (error) {
      toast.error("Greška pri dodavanju predmeta.");
    }
  };

  const handleDeleteSmer = async (id) => {
    try {
      await axiosInstance.delete(`/smer/${id}`);
      toast.success("Smer uspešno obrisan.");
      setSmerovi((prev) => prev.filter((smer) => smer.id !== id));
    } catch (error) {
      toast.error("Greška pri brisanju smera.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(90deg, #003d4d 0%, #005f73 50%, #2c8b94 100%)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-20%",
          width: "140%",
          height: "200%",
          background: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"%3E%3Cpath fill=\"rgba(255,255,255,0.05)\" fill-opacity=\"1\" d=\"M0,192L48,186.7C96,181,192,171,288,160C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\"%3E%3C/path%3E%3C/svg%3E')",
          backgroundSize: "cover",
          opacity: 0.5,
          transform: "rotate(-10deg)",
          zIndex: 0,
        }}
      />

      <motion.div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          position: "relative",
          zIndex: 1,
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: "#005f73", fontWeight: "bold" }}>
            Smerovi - Admin
          </h2>

          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Naziv novog smera"
              value={newSmer}
              onChange={(e) => setNewSmer(e.target.value)}
              style={{ width: "400px", borderRadius: "8px", border: "1px solid #ced4da" }}
            />
            <motion.button
              className="btn d-flex align-items-center justify-content-center gap-1"
              style={{
                width: "100px",
                backgroundColor: "#28a745",
                color: "white",
                borderRadius: "8px",
                padding: "6px 12px",
              }}
              onClick={handleAddSmer}
              whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
              transition={{ duration: 0.3 }}
            >
              <FaPlus /> <span>Dodaj</span>
            </motion.button>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Učitavanje...</span>
              </div>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {smerovi.map((smer) => (
                <motion.li
                  key={smer.id}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {isEditing && selectedSmerForEdit?.id === smer.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editNaziv}
                      onChange={(e) => setEditNaziv(e.target.value)}
                      onBlur={() => handleEditSmer(smer.id)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditSmer(smer.id)}
                      autoFocus
                      style={{ width: "400px", borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  ) : (
                    <span>{smer.naziv || "Nepoznat smer"}</span>
                  )}
                  <div className="d-flex gap-2">
                    <motion.button
                      className="btn d-flex align-items-center justify-content-center gap-1"
                      style={{
                        width: "100px",
                        backgroundColor: "#ffc107",
                        color: "#333",
                        borderRadius: "8px",
                        padding: "6px 12px",
                      }}
                      onClick={() => {
                        setSelectedSmerForEdit(smer);
                        setEditNaziv(smer.naziv);
                        setIsEditing(true);
                        setSelectedSmerForPredmeti(null);
                        setShowPredmetiModal(false);
                      }}
                      whileHover={{ scale: 1.05, backgroundColor: "#e0a800" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaEdit /> <span>Izmeni</span>
                    </motion.button>
                    <motion.button
                      className="btn d-flex align-items-center justify-content-center gap-1"
                      style={{
                        width: "100px",
                        backgroundColor: "#28a745",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                      }}
                      onClick={() => openPredmetiModal(smer)}
                      whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaPlusCircle /> <span>Predmeti</span> {/* Identicno kao "Smerovi" u KatedreAdmin */}
                    </motion.button>
                    <motion.button
                      className="btn d-flex align-items-center justify-content-center gap-1"
                      style={{
                        width: "100px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 12px",
                      }}
                      onClick={() => handleDeleteSmer(smer.id)}
                      whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaTrash /> <span>Obriši</span>
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          {showPredmetiModal && selectedSmerForPredmeti && (
            <div className="modal-overlay">
              <div className="modal-box">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowPredmetiModal(false);
                    setSelectedSmerForPredmeti(null);
                    setSelectedPredmeti([]);
                    setAvailablePredmeti([]);
                    setSelectedSmerForEdit(null);
                    setIsEditing(false);
                  }}
                >
                  <FaTimes />
                </button>
                <h4>Dodaj predmete u {selectedSmerForPredmeti.naziv || "Nepoznat smer"}</h4>
                <div className="predmeti-list">
                  {availablePredmeti.length === 0 ? (
                    <p className="text-muted">Nema dostupnih predmeta za dodavanje.</p>
                  ) : (
                    availablePredmeti.map((predmet) => (
                      <div
                        key={predmet.id}
                        className={`predmet-item ${selectedPredmeti.includes(predmet.id) ? "selected" : ""}`}
                        onClick={() => handleTogglePredmet(predmet.id)}
                      >
                        {predmet.naziv} {selectedPredmeti.includes(predmet.id) && <span>✔</span>}
                      </div>
                    ))
                  )}
                </div>
                <motion.button
                  className="btn d-flex align-items-center justify-content-center gap-1 mt-3"
                  style={{
                    width: "200px",
                    backgroundColor: "#005f73",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 16px",
                  }}
                  onClick={handleDodajPredmete}
                  whileHover={{ scale: 1.05, backgroundColor: "#008cba" }}
                  transition={{ duration: 0.3 }}
                >
                  <FaPlusCircle /> <span>Dodaj izabrane predmete</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        .card {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        input:focus, select:focus {
          border-color: #005f73 !important;
          box-shadow: 0 0 5px rgba(0, 95, 115, 0.5) !important;
          outline: none;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          zIndex: 10;
        }
        .modal-box {
          background: white;
          padding: 20px;
          border-radius: 15px;
          width: 350px;
          text-align: center;
          position: relative;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          border: none;
          background: none;
          font-size: 20px;
          cursor: pointer;
          color: #dc3545;
        }
        .predmeti-list {
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 10px;
          background: #f8f9fa;
        }
        .predmet-item {
          padding: 8px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          transition: background 0.2s;
        }
        .predmet-item:hover {
          background-color: #e9ecef;
        }
        .predmet-item.selected {
          background-color: #28a745;
          color: white;
        }
        .gap-1 {
          gap: 5px; /* Mali razmak između ikone i teksta */
        }
      `}</style>
    </div>
  );
};

export default SmeroviAdmin;