import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaEdit, FaPlusCircle, FaTimes, FaBuilding } from "react-icons/fa";

const KatedreAdmin = () => {
  const [katedre, setKatedre] = useState([]);
  const [smerovi, setSmerovi] = useState([]);
  const [newKatedra, setNewKatedra] = useState("");
  const [selectedKatedra, setSelectedKatedra] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availableSmerovi, setAvailableSmerovi] = useState([]);
  const [selectedSmerovi, setSelectedSmerovi] = useState([]);
  const [showSmeroviModal, setShowSmeroviModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editNaziv, setEditNaziv] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [katedreResponse, smeroviResponse] = await Promise.all([
        axiosInstance.get("/katedra"),
        axiosInstance.get("/smer"),
      ]);
      setKatedre(katedreResponse.data.$values || []);
      setSmerovi(smeroviResponse.data.$values || []);
    } catch (error) {
      toast.error("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKatedra = async () => {
    if (!newKatedra.trim()) {
      toast.error("Naziv ne može biti prazan.");
      return;
    }
    try {
      await axiosInstance.post("/katedra", { naziv: newKatedra });
      toast.success("Katedra uspešno dodata.");
      setNewKatedra("");
      fetchData();
    } catch (error) {
      toast.error("Greška pri unosu katedre.");
    }
  };

  const handleEditKatedra = async (id) => {
    if (!editNaziv.trim()) {
      toast.error("Naziv ne može biti prazan.");
      return;
    }
    try {
      await axiosInstance.put(`/katedra/${id}`, { naziv: editNaziv });
      toast.success("Katedra uspešno izmenjena.");
      setKatedre((prev) => prev.map((kat) => (kat.id === id ? { ...kat, naziv: editNaziv } : kat)));
      setSelectedKatedra(null);
      setIsEditing(false);
      setEditNaziv("");
    } catch (error) {
      toast.error("Greška pri izmeni katedre.");
    }
  };

  const openSmeroviModal = (katedra) => {
    setSelectedKatedra(katedra);
    setSelectedSmerovi([]);
    setShowSmeroviModal(true);
    setIsEditing(false);
    const smeroviKatedre = Array.isArray(katedra.smerovi) ? katedra.smerovi.map((s) => s.id) : [];
    const smeroviKojeNema = smerovi.filter((smer) => !smeroviKatedre.includes(smer.id));
    setAvailableSmerovi(smeroviKojeNema);
  };

  const handleToggleSmer = (smerId) => {
    setSelectedSmerovi((prev) =>
      prev.includes(smerId) ? prev.filter((id) => id !== smerId) : [...prev, smerId]
    );
  };

  const handleDodajSmerove = async () => {
    if (!selectedKatedra || selectedSmerovi.length === 0) {
      toast.error("Izaberite bar jedan smer.");
      return;
    }
    try {
      const smeroviZaSlanje = { smerIds: selectedSmerovi };
      const response = await axiosInstance.put(
        `/katedra/${selectedKatedra.id}/dodaj-smerove`,
        smeroviZaSlanje,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Smerovi uspešno dodati katedri.");
      setKatedre((prev) =>
        prev.map((kat) =>
          kat.id === selectedKatedra.id ? { ...kat, smerovi: response.data.smerovi || kat.smerovi || [] } : kat
        )
      );
      setShowSmeroviModal(false);
      setSelectedSmerovi([]);
      setSelectedKatedra(null);
    } catch (error) {
      toast.error("Greška pri dodavanju smerova.");
    }
  };

  const handleDeleteKatedra = async (id) => {
    try {
      await axiosInstance.delete(`/katedra/${id}`);
      toast.success("Katedra uspešno obrisana.");
      setKatedre((prev) => prev.filter((kat) => kat.id !== id));
    } catch (error) {
      toast.error("Greška pri brisanju katedre.");
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
            <FaBuilding className="me-2" /> Katedre - Admin
          </h2>

          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Naziv nove katedre"
              value={newKatedra}
              onChange={(e) => setNewKatedra(e.target.value)}
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
              onClick={handleAddKatedra}
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
              {katedre.map((kat) => (
                <motion.li
                  key={kat.id}
                  className="list-group-item d-flex justify-content-between align-items-center border-0 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {isEditing && selectedKatedra?.id === kat.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editNaziv}
                      onChange={(e) => setEditNaziv(e.target.value)}
                      onBlur={() => handleEditKatedra(kat.id)}
                      onKeyPress={(e) => e.key === "Enter" && handleEditKatedra(kat.id)}
                      autoFocus
                      style={{ width: "400px", borderRadius: "8px", border: "1px solid #ced4da" }}
                    />
                  ) : (
                    <span>{kat.naziv || "Nepoznata katedra"}</span>
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
                        setSelectedKatedra(kat);
                        setEditNaziv(kat.naziv);
                        setIsEditing(true);
                        setShowSmeroviModal(false);
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
                      onClick={() => openSmeroviModal(kat)}
                      whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaPlusCircle /> <span>Smerovi</span>
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
                      onClick={() => handleDeleteKatedra(kat.id)}
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

          {showSmeroviModal && selectedKatedra && (
            <div className="modal-overlay">
              <div className="modal-box">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowSmeroviModal(false);
                    setSelectedKatedra(null);
                    setSelectedSmerovi([]);
                    setAvailableSmerovi([]);
                    setIsEditing(false);
                  }}
                >
                  <FaTimes />
                </button>
                <h4>Dodaj smerove u {selectedKatedra.naziv || "Nepoznata katedra"}</h4>
                <div className="smerovi-list">
                  {availableSmerovi.length === 0 ? (
                    <p className="text-muted">Nema dostupnih smerova za dodavanje.</p>
                  ) : (
                    availableSmerovi.map((smer) => (
                      <div
                        key={smer.id}
                        className={`smer-item ${selectedSmerovi.includes(smer.id) ? "selected" : ""}`}
                        onClick={() => handleToggleSmer(smer.id)}
                      >
                        {smer.naziv} {selectedSmerovi.includes(smer.id) && <span>✔</span>}
                      </div>
                    ))
                  )}
                </div>
                <motion.button
                  className="btn d-flex align-items-center justify-content-center gap-1"
                  style={{
                    width: "200px",
                    backgroundColor: "#005f73",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 16px",
                  }}
                  onClick={handleDodajSmerove}
                  whileHover={{ scale: 1.05, backgroundColor: "#008cba" }}
                  transition={{ duration: 0.3 }}
                >
                  <FaPlus /> <span>Dodaj izabrane smerove</span>
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
          z-index: 10;
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
        .smerovi-list {
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 10px;
          background: #f8f9fa;
        }
        .smer-item {
          padding: 8px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          transition: background 0.2s;
        }
        .smer-item:hover {
          background-color: #e9ecef;
        }
        .smer-item.selected {
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

export default KatedreAdmin;