import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Dodaje Bootstrap stilove
import 'react-toastify/dist/ReactToastify.css'; // Dodaje Toastify stilove
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer /> {/* Dodajemo ToastContainer */}
  </React.StrictMode>
);


