import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Assuming Framer Motion is available
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'; // Using React Icons

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="d-flex flex-column" style={{ minHeight: isHomePage ? "auto" : "100vh" }}>
      <footer
        className="text-center text-white py-4 mt-auto"
        style={{
          background: "linear-gradient(135deg, #003d4d 0%, #005f73 100%)",
          width: '100%',
          marginTop: isHomePage ? "50px" : "auto",
          paddingTop: isHomePage ? "50px" : "0px",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Background Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div className="row">
            {/* Kontakt */}
            <div className="col-md-4 position-relative">
              <motion.h6
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Kontakt
              </motion.h6>
              <p className="mb-1" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                Fakultet tehničkih nauka<br />
                Trg Dositeja Obradovića 6, Novi Sad<br />
                Telefon: +381 21 450 810<br />
                Email: <motion.a
                  href="mailto:dekanat@uns.ac.rs"
                  className="text-white"
                  whileHover={{ color: '#00b4d8' }}
                  transition={{ duration: 0.3 }}
                >
                  dekanat@uns.ac.rs
                </motion.a>
              </p>
              {/* Divider */}
              <div className="d-none d-md-block" style={{ position: 'absolute', right: 0, top: '20%', height: '60%', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }} />
            </div>

            {/* Brze veze */}
            <div className="col-md-4 position-relative">
              <motion.h6
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Brze veze
              </motion.h6>
              <ul className="list-unstyled mb-1" style={{ fontSize: '12px' }}>
                {[
                  { text: 'Početna', href: 'https://ftn.uns.ac.rs/' },
                  { text: 'Student servis', href: 'https://student.ftn.uns.ac.rs/' },
                  { text: 'Nastavni portal', href: 'https://nastava.ftn.uns.ac.rs/' },
                  { text: 'Kontakt', href: 'https://ftn.uns.ac.rs/kontakt' },
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      className="text-white text-decoration-none"
                      whileHover={{ color: '#00b4d8', x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {link.text}
                    </motion.a>
                  </li>
                ))}
              </ul>
              {/* Divider */}
              <div className="d-none d-md-block" style={{ position: 'absolute', right: 0, top: '20%', height: '60%', borderRight: '1px solid rgba(255, 255, 255, 0.2)' }} />
            </div>

            {/* Pratite nas */}
            <div className="col-md-4">
              <motion.h6
                className="mb-2"
                style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Pratite nas
              </motion.h6>
              <div className="d-flex justify-content-center">
                {[
                  { icon: FaFacebookF, href: 'https://www.facebook.com/ftn.ns' },
                  { icon: FaInstagram, href: 'https://www.instagram.com/ftn_ns/' },
                  { icon: FaTwitter, href: 'https://x.com/ftn_ns' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="me-2"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <social.icon size={22} style={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', padding: '5px' }} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-3">
            <p className="mb-0" style={{ fontSize: '12px', opacity: 0.9 }}>
              © 2025 Fakultet tehničkih nauka. Sva prava zadržana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;