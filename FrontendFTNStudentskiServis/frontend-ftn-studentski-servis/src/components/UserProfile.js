import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUserCircle, FaLock } from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
      } catch (error) {
        toast.error("Greška prilikom učitavanja profila.");
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      toast.error("Nove lozinke se ne poklapaju.");
      return;
    }

    try {
      await axiosInstance.post("/auth/change-password", {
        username: userData.username,
        currentPassword,
        newPassword,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Lozinka uspešno promenjena!");
      setShowChangePassword(false);
    } catch (error) {
      toast.error("Greška prilikom promene lozinke.");
    }
  };

  if (!userData) return <p className="text-center mt-5">Učitavanje podataka...</p>;

  return (
    <motion.div 
      className="container mt-5"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center" style={{ color: "#005f73", fontWeight: "bold" }}>
        <FaUserCircle style={{ marginRight: "8px" }} /> Profil korisnika
      </h2>

      <div className="row justify-content-center mt-4">
        {/* 🔹 Pomereno ka sredini - dodata klasa text-center i centriran sadržaj */}
        <div className="col-md-6 text-center">
          <div className="profile-box p-4">
            <p><strong>Ime:</strong> {userData.ime}</p>
            <p><strong>Prezime:</strong> {userData.prezime}</p>
            <p><strong>Korisničko ime:</strong> {userData.username}</p>
            <p><strong>Uloga:</strong> {userData.role}</p>
            {userData.role === "Student" && (
              <>
                <p><strong>Indeks:</strong> {userData.index}</p>
                <p><strong>Godina upisa:</strong> {userData.godinaUpisa}</p>
              </>
            )}
            <motion.button
              className="btn btn-profile mt-3"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              {showChangePassword ? "Zatvori" : "Promeni lozinku"}
            </motion.button>
          </div>
        </div>

        {showChangePassword && (
          <div className="col-md-6">
            <form onSubmit={handleChangePassword} className="password-box p-4">
              <h3 className="mb-4 text-center" style={{ color: "#2c8b94" }}>
                <FaLock style={{ marginRight: "8px" }} /> Promena lozinke
              </h3>
              <input type="password" className="form-control mb-3" id="currentPassword" placeholder="Trenutna lozinka" required />
              <input type="password" className="form-control mb-3" id="newPassword" placeholder="Nova lozinka" required />
              <input type="password" className="form-control mb-3" id="confirmPassword" placeholder="Potvrdi novu lozinku" required />
              <motion.button
                type="submit"
                className="btn btn-profile"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                Sačuvaj
              </motion.button>
            </form>
          </div>
        )}
      </div>

      {/* 📌 CSS stilovi */}
      <style>{`
        .profile-box {
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .password-box {
          background: #f1f1f1;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .btn-profile {
          background-color: #2c8b94;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
        }

        .btn-profile:hover {
          background-color: #1b6b75;
        }
      `}</style>
    </motion.div>
  );
};

export default UserProfile;
