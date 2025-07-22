import { useEffect } from "react";
import { useSingleGame } from "./contexts/singleGameContext";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import GameOverModal from "./GameOverModal";
import "./SingleNumberGame.css";
import GameStats from "./GameStats";

export default function SingleNumberGame({ accessToken }) {
  const {
    gameState,
    isConnected,
    isLoading,
    error,
    gameOverData,
    connect,
    disconnect,
    startNewGame,
  } = useSingleGame();

  useEffect(() => {
    connect(accessToken);

    return () => {
      disconnect();
    };
  }, [accessToken]);

  const handleStartNewGame = () => {
    startNewGame();
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="connection-screen">
        <div className="connection-text">
          <div className="main-text">Connecting to game server...</div>
          {error && <div className="error-text">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-content">
        <h1 className="game-title">Single Number Game</h1>

        {error && <div className="error-banner">{error}</div>}

        {!gameState ? (
          <div className="start-screen">
            <button onClick={handleStartNewGame} className="start-game-btn">
              Start New Game
            </button>
          </div>
        ) : (
          <div className="game-layout">
            <GameStats gameState={gameState} />
            <GameBoard gameState={gameState} />
            <GameControls
              gameState={gameState}
              onStartNewGame={handleStartNewGame}
            />
          </div>
        )}

        {gameOverData && (
          <GameOverModal
            gameOverData={gameOverData}
            onStartNewGame={handleStartNewGame}
          />
        )}
      </div>
    </div>
  );
}
