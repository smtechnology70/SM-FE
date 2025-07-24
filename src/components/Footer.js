// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
  <footer className="dashboard-footer">
  <div className="dashboard-footer-content">
    <div className="dashboard-footer-logo">
      <span>🎮</span>
      <span>GameHub</span>
    </div>
    <div className="dashboard-footer-links">
      <a href="#">About</a>
      <a href="#">Support</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
    <div className="dashboard-social-links">
      <a href="#" className="dashboard-social-icon">📱</a>
      <a href="#" className="dashboard-social-icon">💬</a>
      <a href="#" className="dashboard-social-icon">📘</a>
      <a href="#" className="dashboard-social-icon">🐦</a>
    </div>
  </div>
  <div className="dashboard-footer-bottom">© 2025 GameHub. All rights reserved</div>
</footer>
  );
};

export default Footer;
