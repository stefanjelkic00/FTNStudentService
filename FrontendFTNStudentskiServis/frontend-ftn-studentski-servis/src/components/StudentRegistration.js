import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";

const StudentRegistration = () => {
  const [smerovi, setSmerovi] = useState([]);

  useEffect(() => {
    const fetchSmerovi = async () => {
      try {
        const response = await axios.get("/smer");
        setSmerovi(response.data.$values || []);
      } catch (error) {
        toast.error("Greška pri učitavanju smerova.");
      }
    };
    fetchSmerovi();
  }, []);

  const formik = useFormik({
    initialValues: {
      Ime: "",
      Prezime: "",
      Username: "",
      Password: "",
      Index: "",
      GodinaUpisa: "",
      SmerId: "",
    },
    validationSchema: Yup.object({
      Ime: Yup.string().required("Ime je obavezno"),
      Prezime: Yup.string().required("Prezime je obavezno"),
      Username: Yup.string().required("Korisničko ime je obavezno"),
      Password: Yup.string()
        .min(6, "Lozinka mora sadržati najmanje 6 karaktera")
        .required("Lozinka je obavezna"),
      Index: Yup.string().required("Indeks je obavezan"),
      GodinaUpisa: Yup.number().required("Godina upisa je obavezna"),
      SmerId: Yup.string().required("Morate izabrati smer"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/auth/register/student", values);
        toast.success(response.data.message || "Student uspešno registrovan!");
        formik.resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || "Greška prilikom registracije.");
      }
    },
  });

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
      {/* Suptilni talasi */}
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
          background:
            "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"%3E%3Cpath fill=\"rgba(255,255,255,0.05)\" fill-opacity=\"1\" d=\"M0,192L48,186.7C96,181,192,171,288,160C384,149,480,139,576,154.7C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\"%3E%3C/path%3E%3C/svg%3E')",
          backgroundSize: "cover",
          opacity: 0.5,
          transform: "rotate(-10deg)",
          zIndex: 0,
        }}
      />

      <motion.div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: "450px",
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
            <FaUserGraduate className="me-2" /> Registracija Studenta
          </h2>
          <form onSubmit={formik.handleSubmit}>
            {["Ime", "Prezime", "Username", "Password", "Index", "GodinaUpisa"].map((field) => (
              <div className="mb-3 position-relative" key={field}>
                <input
                  type={field === "Password" ? "password" : "text"}
                  className="form-control"
                  placeholder={field}
                  {...formik.getFieldProps(field)}
                  style={{
                    paddingLeft: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <div className="text-danger mt-1">{formik.errors[field]}</div>
                )}
              </div>
            ))}

            {/* Dropdown za smerove */}
            <div className="mb-3 position-relative">
              <select
                className="form-control"
                {...formik.getFieldProps("SmerId")}
                style={{
                  paddingLeft: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="">Izaberite smer</option>
                {smerovi.map((smer) => (
                  <option key={smer.id} value={smer.id}>
                    {smer.naziv}
                  </option>
                ))}
              </select>
              {formik.touched.SmerId && formik.errors.SmerId && (
                <div className="text-danger mt-1">{formik.errors.SmerId}</div>
              )}
            </div>

            <motion.button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#005f73",
                color: "white",
                borderRadius: "8px",
                padding: "12px",
                fontWeight: "bold",
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#008cba" }}
              transition={{ duration: 0.3 }}
            >
              Registruj se
            </motion.button>
          </form>
        </div>
      </motion.div>

      <style>{`
        input:focus, select:focus {
          border-color: #005f73 !important;
          box-shadow: 0 0 5px rgba(0, 95, 115, 0.5) !important;
          outline: none;
        }
        .card {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default StudentRegistration;