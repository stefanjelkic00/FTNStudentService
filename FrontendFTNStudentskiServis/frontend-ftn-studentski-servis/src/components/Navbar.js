import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Removed FaChevronDown
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const [isOpen, setIsOpen] = useState(false); // Mobilni meni
  const [dropdownOpen, setDropdownOpen] = useState(null); // Dropdown meni za uloge

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Uspešno ste se odjavili!");
    navigate("/");
  };

  const handleMouseEnter = (role) => {
    setDropdownOpen(role);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(null);
  };

  return (
    <nav
      className="navbar sticky-top navbar-expand-lg"
      style={{
        background: "linear-gradient(135deg, #003d4d 0%, #005f73 100%)",
        padding: "8px 20px",
        boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
        marginBottom: 0,
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link className="navbar-brand logo-wrapper" to="/">
          <motion.img
            src="/FTNLOGO.jpg"
            alt="FTN Logo"
            className="navbar-logo"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
              position: "relative",
              zIndex: 2,
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        <button
          className="navbar-toggler d-lg-none"
          style={{ border: "none", color: "white", fontSize: "20px" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-collapse ${isOpen ? "show" : "collapse"} d-lg-flex`}>
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/login">
                    Prijava
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/register">
                    Registracija
                  </Link>
                </li>
              </>
            ) : (
              <>
                {userRole === "Student" && (
                  <li
                    className="nav-item dropdown"
                    onMouseEnter={() => handleMouseEnter("Student")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="nav-link nav-hover dropdown-toggle">
                      Student {/* Removed FaChevronDown */}
                    </div>
                    {dropdownOpen === "Student" && (
                      <motion.ul
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link className="dropdown-item" to="/student/svi-predmeti">
                            Svi predmeti
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/student/prijava-ispita">
                            Prijava ispita
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/student/polozeni-predmeti">
                            Položeni predmeti
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/student/prijavljeni-predmeti">
                            Prijavljeni predmeti
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </li>
                )}

                {userRole === "Profesor" && (
                  <li
                    className="nav-item dropdown"
                    onMouseEnter={() => handleMouseEnter("Profesor")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="nav-link nav-hover dropdown-toggle">
                      Profesor {/* Removed FaChevronDown */}
                    </div>
                    {dropdownOpen === "Profesor" && (
                      <motion.ul
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link className="dropdown-item" to="/profesor/predmeti-sa-prijavama">
                            Moji predmeti
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profesor/ocenjeni-studenti">
                            Ocene studenata
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profesor/apliciranje-predmeta">
                            Apliciranje predmeta
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/profesor/moji-zahtevi">
                            Moji zahtevi
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </li>
                )}

                {userRole === "Admin" && (
                  <li
                    className="nav-item dropdown"
                    onMouseEnter={() => handleMouseEnter("Admin")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="nav-link nav-hover dropdown-toggle">
                      Admin {/* Removed FaChevronDown */}
                    </div>
                    {dropdownOpen === "Admin" && (
                      <motion.ul
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link className="dropdown-item" to="/admin/zahtevi-profesora">
                            Zahtevi Profesora
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/users">
                            Korisnici
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/katedre">
                            Katedre
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/smerovi">
                            Smerovi
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/predmeti">
                            Predmeti
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </li>
                )}

                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/profile">
                    <FaUserCircle style={{ marginRight: "5px" }} /> Profil
                  </Link>
                </li>
                <li className="nav-item">
                  <motion.button
                    className="nav-link nav-hover btn-logout"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    Odjava
                  </motion.button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .navbar {
          z-index: 1000;
          background: linear-gradient(135deg, #003d4d 0%, #005f73 100%);
          backdrop-filter: blur(5px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 0 !important;
          padding-bottom: 0;
        }
        .logo-wrapper {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 80px;
        }
        .navbar-logo {
          z-index: 2;
        }
        .logo-wrapper::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0) 20%, rgba(0, 61, 77, 0.9) 80%);
          filter: blur(12px);
          z-index: 1;
          border-radius: 50%;
          opacity: 0.8;
        }
        .nav-link, .dropdown-toggle {
          color: white !important;
          font-weight: 500;
          font-size: 15px;
          padding: 6px 12px;
          margin: 0 5px;
          border-radius: 6px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        .nav-hover:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        .btn-logout {
          background: rgba(255, 77, 77, 0.9);
          border: none;
          padding: 6px 12px;
        }
        .btn-logout:hover {
          background: rgba(255, 77, 77, 1);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: linear-gradient(135deg, #005f73 0%, #2c8b94 100%);
          border: none;
          border-radius: 6px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          padding: 8px 0;
          min-width: 180px;
          display: block;
        }
        .dropdown-item {
          color: white;
          padding: 6px 12px;
          transition: all 0.3s ease;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .navbar-collapse.show {
          background: linear-gradient(135deg, #005f73 0%, #2c8b94 100%);
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          padding: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          margin-top: 0;
        }
        @media (min-width: 992px) {
          .navbar-collapse {
            background: none;
            position: static;
            box-shadow: none;
          }
          .dropdown-menu {
            left: auto;
            right: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;