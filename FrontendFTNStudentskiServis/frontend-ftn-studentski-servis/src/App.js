import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import StudentRegistration from "./components/StudentRegistration";
import ProfesorRegistration from "./components/ProfesorRegistration";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// 📌 Dodate komponente za prikaz katedri, smerova i predmeta
import Katedre from "./components/Katedre";
import Smerovi from "./components/Smerovi";
import Predmeti from "./components/Predmeti";
import KatedraDetalji from "./components/KatedraDetalji";
import SmerDetalji from "./components/SmerDetalji";

// 📌 Komponente za studenta
import SviPredmeti from "./components/student/SviPredmeti";
import PrijavaIspita from "./components/student/PrijavaIspita";
import PolozeniPredmeti from "./components/student/PolozeniPredmeti";
import PrijavljeniPredmeti from "./components/student/PrijavljeniPredmeti";

// 📌 Komponente za profesora
import PredmetiProfesora from "./components/profesor/PredmetiProfesora";
import OceneStudenata from "./components/profesor/OceneStudenata";
import ApliciranjePredmeta from "./components/profesor/ApliciranjePredmeta";
import MojiZahtevi from "./components/profesor/MojiZahtevi";

// 📌 Komponente za admina
import AdminZahteviProfesora from "./components/admin/AdminZahteviProfesora";
import Users from "./components/admin/Users";
import KatedreAdmin from "./components/admin/KatedreAdmin";
import SmeroviAdmin from "./components/admin/SmeroviAdmin";
import PredmetiAdmin from "./components/admin/PredmetiAdmin";



import FakultetskeInformacije from "./components/FakultetskeInformacije";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* 📌 Neulogovani korisnici */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/profesor" element={<ProfesorRegistration />} />
          <Route path="/katedre" element={<Katedre />} />
          <Route path="/smerovi" element={<Smerovi />} />
          <Route path="/predmeti" element={<Predmeti />} />
          <Route path="/fakultetske-informacije" element={<FakultetskeInformacije />} />

          {/* 📌 Dodate rute za prikaz detalja katedre i smera */}
          <Route path="/katedra/:id" element={<KatedraDetalji />} />
          <Route path="/smer/:id" element={<SmerDetalji />} />


          {/* 📌 Zaštićene rute */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />


          <Route
            path="/student/svi-predmeti"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <SviPredmeti />
              </ProtectedRoute>
            }
          />

          {/* 📌 Student rute */}
          <Route
            path="/student/prijava-ispita"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PrijavaIspita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/polozeni-predmeti"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PolozeniPredmeti />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/prijavljeni-predmeti"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PrijavljeniPredmeti />
              </ProtectedRoute>
            }
          />

          {/* 📌 Profesor rute */}
          <Route
            path="/profesor/predmeti-sa-prijavama"
            element={
              <ProtectedRoute allowedRoles={["Profesor"]}>
                <PredmetiProfesora />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profesor/ocenjeni-studenti"
            element={
              <ProtectedRoute allowedRoles={["Profesor"]}>
                <OceneStudenata />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profesor/apliciranje-predmeta"
            element={
              <ProtectedRoute allowedRoles={["Profesor"]}>
                <ApliciranjePredmeta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profesor/moji-zahtevi"
            element={
              <ProtectedRoute allowedRoles={["Profesor"]}>
                <MojiZahtevi />
              </ProtectedRoute>
            }
          />

          
        {/* 📌 Admin rute */}
        
          <Route
            path="/admin/zahtevi-profesora"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminZahteviProfesora />
              </ProtectedRoute>
            }
          />
          {/* 📌 NOVO: Admin podstranice */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/katedre"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <KatedreAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/smerovi"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SmeroviAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/predmeti"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PredmetiAdmin />
              </ProtectedRoute>
            }
          />


        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
