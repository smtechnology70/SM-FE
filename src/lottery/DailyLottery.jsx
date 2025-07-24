import { useCallback, useEffect, useState } from "react";
import signalRService from "./services/lotteryService";
import { dailyNumberService } from "./services/api";
import "./main.css"; // Assuming you have a CSS file for styling

const DailyLottery = () => {
  const [gameState, setGameState] = useState(null);
  const [winners, setWinners] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [guessedNumber, setGuessedNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [connected, setConnected] = useState(false);

  // SignalR event handlers
  const handleGameState = useCallback((data) => {
    setGameState(data.gameState);
  }, []);

  const handleGuessSubmitted = useCallback((data) => {
    setMessage({
      type: data.isWinner ? "success" : "info",
      text: data.message,
    });
    loadGameData();
  }, []);

  const handleNewWinner = useCallback((winner) => {
    setMessage({
      type: "success",
      text: `🎉 ${winner.username} just won with number ${winner.guessedNumber}!`,
    });
    loadWinners();
  }, []);

  const handleError = useCallback((error) => {
    setMessage({
      type: "error",
      text: error,
    });
  }, []);

  // Initialize SignalR connection
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        await signalRService.connect();
        setConnected(true);

        // Add event listeners
        signalRService.addListener("GameState", handleGameState);
        signalRService.addListener("GuessSubmitted", handleGuessSubmitted);
        signalRService.addListener("NewWinner", handleNewWinner);
        signalRService.addListener("Error", handleError);

        // Join the daily game
        await signalRService.joinDailyGame();
        await signalRService.getGameState();
      } catch (error) {
        console.error("SignalR connection failed:", error);
        setMessage({
          type: "warning",
          text: "Real-time updates unavailable. Using HTTP polling.",
        });
      }
    };

    initializeSignalR();
    loadGameData();
    loadWinners();
    loadRecentGames();

    return () => {
      // Cleanup SignalR listeners
      signalRService.removeListener("GameState", handleGameState);
      signalRService.removeListener("GuessSubmitted", handleGuessSubmitted);
      signalRService.removeListener("NewWinner", handleNewWinner);
      signalRService.removeListener("Error", handleError);
    };
  }, [handleGameState, handleGuessSubmitted, handleNewWinner, handleError]);

  // Timer for time remaining
  useEffect(() => {
    if (gameState?.timeRemaining) {
      const interval = setInterval(() => {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const remaining = endOfDay - now;

        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining("Game ended");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  const loadGameData = async () => {
    try {
      const response = await dailyNumberService.getTodaysGame();
      setGameState(response.data);
    } catch (error) {
      console.error("Failed to load game data:", error);
      setMessage({
        type: "error",
        text: "Failed to load game data",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWinners = async () => {
    try {
      const response = await dailyNumberService.getTodaysWinners();
      setWinners(response.data);
    } catch (error) {
      console.error("Failed to load winners:", error);
    }
  };

  const loadRecentGames = async () => {
    try {
      const response = await dailyNumberService.getRecentGames(7);
      setRecentGames(response.data);
    } catch (error) {
      console.error("Failed to load recent games:", error);
    }
  };

  const handleSubmitGuess = async (e) => {
    e.preventDefault();

    const number = parseInt(guessedNumber);
    if (isNaN(number) || number < 0 || number > 99) {
      setMessage({
        type: "error",
        text: "Please enter a number between 0 and 99",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      if (connected) {
        // Use SignalR for real-time submission
        await signalRService.submitGuess(number);
      } else {
        // Fallback to HTTP API
        const response = await dailyNumberService.submitGuess(number);
        setMessage({
          type: response.data.isWinner ? "success" : "info",
          text: response.data.message,
        });
        loadGameData();
        loadWinners();
      }

      setGuessedNumber("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Failed to submit guess",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Game Header */}
      <div className="card fade-in">
        <div className="card-header">
          <h1 className="card-title">🎲 Daily Number Lottery</h1>
          <p className="card-subtitle">
            Guess a number between 0-99 and win big!
          </p>
          {timeRemaining && (
            <div className="timer">Time remaining: {timeRemaining}</div>
          )}
        </div>

        {/* Connection Status */}
        {!connected && (
          <div className="status-message status-warning">
            Real-time updates unavailable - using fallback mode
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`status-message status-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Winner Announcement */}
        {gameState?.playerIsWinner && (
          <div className="winner-announcement">
            <h2>🎉 Congratulations!</h2>
            <p>You guessed the correct number: {gameState.playerGuess}!</p>
          </div>
        )}

        {/* Game Section */}
        <div className="game-section">
          {!gameState?.hasPlayerEntered ? (
            <form onSubmit={handleSubmitGuess}>
              <div className="number-input-section">
                <label htmlFor="guess">Enter your lucky number:</label>
                <input
                  id="guess"
                  type="number"
                  min="0"
                  max="99"
                  value={guessedNumber}
                  onChange={(e) => setGuessedNumber(e.target.value)}
                  className="number-input"
                  placeholder="0-99"
                  required
                />
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Guess"}
                </button>
              </div>
            </form>
          ) : (
            <div className="game-info">
              <div className="info-item">
                <div className="info-label">Your Guess</div>
                <div className="info-value">{gameState.playerGuess}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Submitted</div>
                <div className="info-value">
                  {formatTime(gameState.playerEntryTime)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Result</div>
                <div className="info-value">
                  {gameState.playerIsWinner ? "🏆 Winner!" : "⏳ Waiting..."}
                </div>
              </div>
            </div>
          )}

          {/* Game Statistics */}
          <div className="game-info">
            <div className="info-item">
              <div className="info-label">Total Entries</div>
              <div className="info-value">{gameState?.totalEntries || 0}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Total Winners</div>
              <div className="info-value">{gameState?.totalWinners || 0}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Date</div>
              <div className="info-value">
                {gameState?.date ? formatDate(gameState.date) : "Today"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Winners */}
      {winners.length > 0 && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title">🏆 Today's Winners</h2>
          </div>
          <div className="winners-list">
            {winners.map((winner, index) => (
              <div key={index} className="winner-item">
                <div>
                  <div className="winner-name">{winner.username}</div>
                  <div className="winner-time">
                    {formatTime(winner.entryTime)}
                  </div>
                </div>
                <div className="winner-number">{winner.guessedNumber}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Games */}
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📊 Recent Games</h2>
        </div>
        <div className="recent-games">
          {recentGames.map((game, index) => (
            <div key={index} className="game-history-item">
              <div className="game-date">{formatDate(game.date)}</div>
              <div className="winning-number">
                Winning Number: {game.winningNumber}
              </div>
              <div className="game-stats">
                {game.totalEntries} entries • {game.totalWinners} winners
              </div>
              {game.winners.length > 0 && (
                <div className="game-stats">
                  Winners: {game.winners.map((w) => w.username).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyLottery;
