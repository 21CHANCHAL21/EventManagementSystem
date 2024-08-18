// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
        </div>
        <p className="footer-text">© 2024 Event Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
