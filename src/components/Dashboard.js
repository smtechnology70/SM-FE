// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import "./Dashboard.css";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [activeGame, setActiveGame] = useState(null);
  const navigate = useNavigate();

  const userData = {
    username: "GameMaster",
    level: 24,
    coins: 3850,
    avatar: "https://i.pravatar.cc/150?img=5",
    progress: 100,
  };

  const games = [
    {
      id: "box-open",
      title: "Box Open",
      description: "Reveal boxes strategically without hitting zero",
      icon: "📦",
      bgColor: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      stats: { players: "12.4K", rating: 4.8 },
    },
    {
      id: "ludo",
      title: "Ludo King",
      description: "Classic board game with friends and players worldwide",
      icon: "🎲",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      stats: { players: "18.7K", rating: 4.9 },
    },
    {
      id: "single-open",
      title: "Single Open",
      description: "Test your luck with single box reveals",
      icon: "🎯",
      bgColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      stats: { players: "8.2K", rating: 4.5 },
    },
  ];

  const openGame = (gameId) => {
    setActiveGame(gameId);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  useEffect(() => {
    if (!activeGame) return;
    const timer = setTimeout(() => {
      switch (activeGame) {
        case "box-open":
          navigate("/box-open");
          break;
        case "ludo":
          navigate("/ludo");
          break;
        case "single-open":
          navigate("/single");
          break;
        default:
          break;
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeGame, navigate]);

  return (
   <div className="dashboard-container">
  <Navbar userData={userData} />

  <main className="dashboard-main">
    {activeGame ? (
      <div className="dashboard-game-active-view">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-game-header"
        >
          <motion.button
            className="dashboard-back-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={closeGame}
          >
            ← Back to Dashboard
          </motion.button>
          <h2>{games.find((g) => g.id === activeGame)?.title || "Game"}</h2>
        </motion.div>

        <motion.div
          className="dashboard-game-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="dashboard-dash-game-placeholder">
            <div className="dashboard-dash-placeholder-icon">
              {games.find((g) => g.id === activeGame)?.icon || "🎮"}
            </div>
            <h3>
              {games.find((g) => g.id === activeGame)?.title || "Game"} is
              Loading
            </h3>
            <p>Get ready to play!</p>
            <div className="dashboard-loading-animation">
              <div className="dashboard-pulse-dot"></div>
              <div className="dashboard-pulse-dot"></div>
              <div className="dashboard-pulse-dot"></div>
            </div>
          </div>
        </motion.div>
      </div>
    ) : (
      <>
        {/* Hero Section */}
        <section className="dashboard-hero-section">
          <motion.div
            className="dashboard-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Welcome to GameHub</h1>
          </motion.div>

          <motion.div
            className="dashboard-hero-illustration"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="dashboard-floating-games">
              <div className="dashboard-floating-game">📦</div>
              <div className="dashboard-floating-game">🎲</div>
              <div className="dashboard-floating-game">🎯</div>
            </div>
          </motion.div>
        </section>

        {/* Games Grid */}
        <section className="dashboard-games-section">
          <h2>Featured Games</h2>
          <div className="dashboard-games-grid">
            {games.map((game) => (
              <motion.div
                key={game.id}
                className="dashboard-game-card"
                style={{ background: game.bgColor }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                }}
                onClick={() => openGame(game.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="dashboard-game-icon">{game.icon}</div>
                <div className="dashboard-dash-game-info">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </>
    )}
  </main>

  <Footer />
</div>
  );
};

export default Dashboard;
