import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import "./DailyDigitGame.css";
import { API_BASE_URL, WS_BASE_URL } from "../constant";
import { getAccessToken } from "../auth/tokenService";
import { refreshTokenIfNeeded } from "../utils/apiClient";

const DailyDigitGame = () => {
  const [gameState, setGameState] = useState(null);
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [digitCounts, setDigitCounts] = useState({});
  const [winners, setWinners] = useState([]);
  const [recentGames, setRecentGames] = useState([]);

  const userSelectedDigit = gameState?.playerSelectedDigit;
  const hasUserSelected = gameState?.hasPlayerEntered;

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    setupSignalRConnection();
    fetchInitialData();

    // Setup timer for countdown
    const timer = setInterval(() => {
      if (gameState?.timeRemaining) {
        updateTimeRemaining();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const setupSignalRConnection = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      refreshTokenIfNeeded();

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${WS_BASE_URL}/dailyDigitGameHub`, {
          withCredentials: true,
          accessTokenFactory: getAccessToken,
        })
        .withAutomaticReconnect()
        .build();

      // Setup event handlers
      newConnection.on("GameState", (state) => {
        console.log("Received game state:", state);
        setGameState(state);
        setDigitCounts(state.digitCounts || {});
        setTimeRemaining(state.timeRemaining);
        setLoading(false);
      });

      newConnection.on("DigitSubmitted", (data) => {
        console.log("Digit submitted:", data);
        // Refresh game state
        newConnection.invoke("GetGameState");
      });

      newConnection.on("GameStatistics", (stats) => {
        console.log("Game statistics updated:", stats);
        setDigitCounts(stats.digitCounts || {});
      });

      newConnection.on("TodaysWinners", (winnersList) => {
        console.log("Today's winners:", winnersList);
        setWinners(winnersList);
      });

      newConnection.on("Error", (errorMessage) => {
        console.error("SignalR Error:", errorMessage);
        setError(errorMessage);
      });

      await newConnection.start();
      console.log("SignalR Connected");

      // Join the game room
      await newConnection.invoke("JoinDailyDigitGame");

      setConnection(newConnection);
    } catch (err) {
      console.error("SignalR Connection failed:", err);
      setError("Failed to connect to game server");
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Fetch today's game data
      const response = await fetch(`${API_BASE_URL}/DailyDigitGame/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGameState(data);
        setDigitCounts(data.digitCounts || {});
        setTimeRemaining(data.timeRemaining);
      }

      // Fetch recent games
      const recentResponse = await fetch(
        `${API_BASE_URL}/DailyDigitGame/recent-games`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentGames(recentData);
      }

      // Fetch today's winners
      const winnersResponse = await fetch(
        `${API_BASE_URL}/DailyDigitGame/winners/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (winnersResponse.ok) {
        const winnersData = await winnersResponse.json();
        setWinners(winnersData);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      setError("Failed to load game data");
      setLoading(false);
    }
  };

  const submitDigit = async (digit) => {
    try {
      if (connection && connection.state === "Connected") {
        await connection.invoke("SubmitDigit", digit);
      } else {
        // Fallback to HTTP API
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/DailyDigitGame/submit-digit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedDigit: digit }),
          }
        );

        if (response.ok) {
          fetchInitialData(); // Refresh data
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to submit digit");
        }
      }
    } catch (err) {
      console.error("Error submitting digit:", err);
      setError("Failed to submit digit");
    }
  };

  const updateTimeRemaining = () => {
    if (!gameState?.timeRemaining) return;

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setHours(0, 0, 0, 0);

    const remaining = endOfDay - now;
    setTimeRemaining(remaining);
  };

  const formatTimeRemaining = (milliseconds) => {
    if (!milliseconds || milliseconds <= 0) return "00:00:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getDigitPopularity = (digit) => {
    const count = digitCounts[digit] || 0;
    const total = Object.values(digitCounts).reduce((sum, c) => sum + c, 0);
    return total > 0 ? (count / total) * 100 : 0;
  };

  const getLowestCountDigits = () => {
    const counts = Object.entries(digitCounts).filter(
      ([_, count]) => count > 0
    );
    if (counts.length === 0) return [];

    const minCount = Math.min(...counts.map(([_, count]) => count));
    return counts
      .filter(([_, count]) => count === minCount)
      .map(([digit, _]) => parseInt(digit));
  };

  if (loading) {
    return (
      <div className="daily-digit-game loading">
        <div className="spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-digit-game error">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const lowestDigits = getLowestCountDigits();

  const confirmDigitSelection = (digit) => {
    if (
      window.confirm(
        `Are you sure you want to select digit ${digit}? You cannot change your selection after confirming.`
      )
    ) {
      submitDigit(digit);
    }
  };

  return (
    <div className="daily-digit-game">
      <div className="game-header">
        <h1>Daily Digit Game</h1>
        <p className="game-description">
          Choose a digit from 0-9. The digit selected by the fewest players
          wins!
        </p>
        {timeRemaining && (
          <div className="time-remaining">
            <span className="label">Time Remaining:</span>
            <span className="time">{formatTimeRemaining(timeRemaining)}</span>
          </div>
        )}
      </div>

      <div className="game-content">
        <div className="main-section">
          {/* Digit Selection */}
          {hasUserSelected ? (
            <div className="already-selected">
              <div className="selected-digit-display">
                <h3>Your Selected Digit</h3>
                <div className="selected-digit-circle">{userSelectedDigit}</div>
                <p>You have already selected your digit for today</p>
                <p className="selection-time">
                  Selected at:{" "}
                  {new Date(gameState.playerEntryTime).toLocaleString()}
                </p>
                {gameState.isGameCompleted && (
                  <div
                    className={`game-result ${
                      gameState.playerIsWinner ? "winner" : "not-winner"
                    }`}
                  >
                    {gameState.playerIsWinner ? (
                      <>
                        <span className="result-icon">🎉</span>
                        <span>Congratulations! You Won!</span>
                      </>
                    ) : (
                      <>
                        <span className="result-icon">😊</span>
                        <span>Better luck tomorrow!</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : gameState?.isGameCompleted ? (
            <div className="game-ended">
              <h3>Today's Game Has Ended</h3>
              <p>Come back tomorrow for a new game!</p>
              {gameState.winningDigit !== null && (
                <p>
                  Today's winning digit was:{" "}
                  <strong>{gameState.winningDigit}</strong>
                </p>
              )}
            </div>
          ) : (
            <div className="digit-selection-grid">
              <h3>Choose Your Lucky Digit</h3>
              <p className="selection-hint">
                Remember: You can only choose once per day!
              </p>
              <div className="digit-buttons">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    className={`digit-button ${
                      lowestDigits.includes(digit) ? "lowest" : ""
                    }`}
                    onClick={() => confirmDigitSelection(digit)}
                    title={`${
                      digitCounts[digit] || 0
                    } players selected this digit`}
                  >
                    <span className="digit">{digit}</span>
                    <span className="count">{digitCounts[digit] || 0}</span>
                    <div
                      className="popularity-bar"
                      style={{ width: `${getDigitPopularity(digit)}%` }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* <div className="digit-selection">
            <h2>Select Your Digit</h2>
            {gameState?.HasPlayerEntered ? (
              <div className="already-selected">
                <p>
                  You have selected digit:{" "}
                  <strong>{gameState.PlayerSelectedDigit}</strong>
                </p>
                <p className="entry-time">
                  Selected at:{" "}
                  {new Date(gameState.PlayerEntryTime).toLocaleString()}
                </p>
                {gameState.IsGameCompleted && (
                  <div
                    className={`result ${
                      gameState.PlayerIsWinner ? "winner" : "loser"
                    }`}
                  >
                    {gameState.PlayerIsWinner
                      ? "🎉 You Won!"
                      : "Better luck next time!"}
                  </div>
                )}
              </div>
            ) : gameState?.IsGameCompleted ? (
              <div className="game-ended">
                <p>Today's game has ended. Come back tomorrow!</p>
                {gameState.WinningDigit !== null && (
                  <p>
                    Winning digit was: <strong>{gameState.WinningDigit}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="digit-buttons">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    className={`digit-button ${
                      lowestDigits.includes(digit) ? "lowest" : ""
                    }`}
                    onClick={() => submitDigit(digit)}
                    title={`${
                      digitCounts[digit] || 0
                    } players selected this digit`}
                  >
                    <span className="digit">{digit}</span>
                    <span className="count">{digitCounts[digit] || 0}</span>
                    <div
                      className="popularity-bar"
                      style={{ width: `${getDigitPopularity(digit)}%` }}
                    ></div>
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {/* Live Statistics */}
          <div className="live-stats">
            <h3>Live Statistics</h3>
            <div className="stats-grid">
              <div className="stat">
                <span className="value">{gameState?.totalEntries || 0}</span>
                <span className="label">Total Players</span>
              </div>
              <div className="stat">
                <span className="value">{gameState?.totalWinners || 0}</span>
                <span className="label">Winners</span>
              </div>
              <div className="stat">
                <span className="value">
                  {gameState?.isGameCompleted
                    ? gameState?.winningDigit ?? "-"
                    : "-"}
                </span>
                <span className="label">Winning Digit</span>
              </div>
            </div>
          </div>

          {/* Digit Popularity Chart */}
          <div className="popularity-chart">
            <h3>Digit Popularity</h3>
            <div className="chart">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <div key={digit} className="chart-bar">
                  <div
                    className={`bar ${
                      lowestDigits.includes(digit) ? "lowest" : ""
                    }`}
                    style={{
                      height: `${Math.max(getDigitPopularity(digit), 2)}%`,
                    }}
                  ></div>
                  <span className="digit-label">{digit}</span>
                  <span className="count-label">{digitCounts[digit] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar">
          {/* Today's Winners */}
          {winners.length > 0 && (
            <div className="winners-section">
              <h3>Today's Winners</h3>
              <div className="winners-list">
                {winners.map((winner, index) => (
                  <div key={index} className="winner">
                    <span className="username">{winner.username}</span>
                    <span className="digit">Digit {winner.selectedDigit}</span>
                    <span className="time">
                      {new Date(winner.entryTime).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Games */}
          {recentGames.length > 0 && (
            <div className="recent-games">
              <h3>Recent Games</h3>
              <div className="games-list">
                {recentGames.slice(0, 5).map((game, index) => (
                  <div key={index} className="game-item">
                    <div className="game-date">
                      {new Date(game.date).toLocaleDateString()}
                    </div>
                    <div className="game-info">
                      <span>Winning: {game.winningDigit ?? "TBD"}</span>
                      <span>{game.totalWinners} winners</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Rules */}
          <div className="game-rules">
            <h3>How to Play</h3>
            <ul>
              <li>Choose any digit from 0 to 9</li>
              <li>You can only choose once per day</li>
              <li>The digit chosen by the fewest players wins</li>
              <li>Results announced at midnight</li>
              <li>Multiple winners split the victory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDigitGame;
