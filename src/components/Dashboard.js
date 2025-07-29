// src/components/Dashboard.js
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [activeGame, setActiveGame] = useState(null);
  const navigate = useNavigate();

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
    {
      id: "daily-number-lottery",
      title: "Daily Number Lottery",
      description: "Guess a number between 0-99 and win big!",
      icon: "🎰",
      bgColor: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
      stats: { players: "15.3K", rating: 4.7 },
    },
    {
      id: "daily-digit-game",
      title: "Daily Digit Game",
      description:
        "Choose a digit from 0-9. The digit selected by the fewest players wins!",
      icon: "🔟",
      bgColor: "linear-gradient(135deg, #00CDAC 0%, #02AAB0 100%)",
      stats: { players: "11.6K", rating: 4.6 },
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
          navigate("/zeroblast");
          break;
        case "ludo":
          navigate("/ludo");
          break;
        case "single-open":
          navigate("/single");
          break;
        case "daily-number-lottery":
          navigate("/lottery");
          break;
        case "daily-digit-game":
          navigate("/dailyDigitGame");
          break;
        default:
          break;
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeGame, navigate]);

  return (
    <div className="dashboard-container">
      <Navbar />

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
                  <div className="dashboard-floating-game">🎰</div>
                  <div className="dashboard-floating-game">🔟</div>
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
