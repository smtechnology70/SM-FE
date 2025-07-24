// src/components/Navbar.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { clearTokens } from "./../auth/tokenService";
import { useNavigate } from "react-router";

const Navbar = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const Username = localStorage.getItem("username")

  const handlelogout = () => {
    clearTokens();
    localStorage.removeItem("username")
    navigate("/login");
  };

  return (
    <nav className="dashboard-nav">
  <div className="dashboard-nav-left">
    <motion.div className="dashboard-logo" whileHover={{ rotate: 10 }}>
      <span className="dashboard-logo-icon">🎮</span>
      <span className="dashboard-logo-text">GameHub</span>
    </motion.div>
  </div>

  <div className="dashboard-nav-center">
    <motion.div className="dashboard-nav-item dashboard-active" whileHover={{ scale: 1.05 }}>
      Dashboard
    </motion.div>
    <motion.div className="dashboard-nav-item" whileHover={{ scale: 1.05 }}>
      Leaderboard
    </motion.div>
    <motion.div className="dashboard-nav-item" whileHover={{ scale: 1.05 }}>
      Challenges
    </motion.div>
  </div>

  <div className="dashboard-nav-right">
    <motion.div
      className="dashboard-user-profile"
      whileHover={{ scale: 1.05 }}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <div className="dashboard-user-avatar">
        <img src={userData.avatar} alt={userData.username} />
      </div>
      <div className="dashboard-user-info">
        <span className="dashboard-username">{userData.username}</span>
      </div>

      {isMenuOpen && (
        <motion.div
          className="dashboard-user-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="dashboard-menu-item">Profile</div>
          <div className="dashboard-menu-item">Settings</div>
          <div className="dashboard-menu-item">Friends</div>
          <div className="dashboard-menu-item" onClick={() => handlelogout()}>
            Logout
          </div>
        </motion.div>
      )}
    </motion.div>
  </div>
</nav>

  );
};

export default Navbar;
