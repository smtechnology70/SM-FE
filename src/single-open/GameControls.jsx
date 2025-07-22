import { useSingleGame } from "./contexts/singleGameContext";

export default function GameControls({ gameState, onStartNewGame }) {
  const { stopGame } = useSingleGame();

  const handleStopGame = () => {
    if (
      window.confirm(
        "Are you sure you want to stop the game now? Your final result will be based on your current sum."
      )
    ) {
      stopGame();
    }
  };

  return (
    <div className="game-controls">
      <h2 className="controls-title">Game Controls</h2>

      <div className="controls-buttons">
        {gameState.status === "Playing" && gameState.revealedBoxesCount > 0 && (
          <button onClick={handleStopGame} className="stop-game-btn">
            Stop Game Now
          </button>
        )}

        {gameState.isGameFinished && (
          <button onClick={onStartNewGame} className="new-game-btn">
            Start New Game
          </button>
        )}
      </div>

      {gameState.status === "Playing" && (
        <div className="controls-instructions">
          <p>You can stop the game early to lock in your current result,</p>
          <p>or continue revealing boxes (up to {gameState.maxBoxes} total).</p>
        </div>
      )}
    </div>
  );
}
