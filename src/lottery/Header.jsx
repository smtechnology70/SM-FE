import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          🎲 Lottery Game
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-link">
          Daily Lottery
        </Link>
        <Link to="/history" className="nav-link">
          History
        </Link>
      </nav>

      <div className="user-info">
        <span>Welcome, {user?.userName}!</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
