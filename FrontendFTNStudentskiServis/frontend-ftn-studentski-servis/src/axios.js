import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5299/api", // API endpoint
  headers: {
    "Content-Type": "application/json",
  },
});

// Dodavanje tokena u svaki zahtev ako je korisnik prijavljen
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API zahtevi
export const fetchKatedre = () => axiosInstance.get("/katedra");
export const fetchSmerovi = () => axiosInstance.get("/smer");
export const fetchPredmeti = () => axiosInstance.get("/predmet");

export default axiosInstance;
