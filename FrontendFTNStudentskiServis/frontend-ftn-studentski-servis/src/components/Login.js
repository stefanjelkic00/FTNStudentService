import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignInAlt, FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5299/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Neispravni podaci za prijavu.");
      }
    } catch (error) {
      setErrorMessage("Trenutno nije moguće povezati se sa serverom.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(90deg, #003d4d 0%, #005f73 50%, #2c8b94 100%)", // Horizontalni gradijent
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Suptilni talasi kao dekoracija */}
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
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.95)", // Blago providna bela za kontrast
          position: "relative",
          zIndex: 1,
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4" style={{ color: "#005f73", fontWeight: "bold" }}>
            <FaSignInAlt style={{ marginRight: "10px" }} /> Prijava
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <FaUser
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#005f73",
                }}
              />
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Korisničko ime"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  paddingLeft: "35px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  transition: "border-color 0.3s ease",
                }}
              />
            </div>
            <div className="mb-3 position-relative">
              <FaLock
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#005f73",
                }}
              />
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Lozinka"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  paddingLeft: "35px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  transition: "border-color 0.3s ease",
                }}
              />
            </div>
            {errorMessage && (
              <div className="alert alert-danger text-center py-2" style={{ borderRadius: "8px" }}>
                {errorMessage}
              </div>
            )}
            {isLoading && (
              <div className="alert alert-info text-center py-2" style={{ borderRadius: "8px" }}>
                Molimo sačekajte...
              </div>
            )}
            <motion.button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#005f73",
                color: "white",
                borderRadius: "8px",
                padding: "10px",
                fontWeight: "bold",
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#008cba" }}
              transition={{ duration: 0.3 }}
              disabled={isLoading}
            >
              {isLoading ? "Prijava..." : "Prijavi se"}
            </motion.button>
          </form>
          <p className="text-center mt-3" style={{ color: "#666" }}>
            Nemate nalog?{" "}
            <a href="/register" style={{ color: "#005f73", fontWeight: "bold" }}>
              Registrujte se
            </a>
          </p>
        </div>
      </motion.div>

      {/* Dodatni CSS stilovi */}
      <style>{`
        input:focus {
          border-color: #005f73 !important;
          box-shadow: 0 0 5px rgba(0, 95, 115, 0.5) !important;
          outline: none;
        }
        .card {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login;