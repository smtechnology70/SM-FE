import "./gameOverModal.css";

export default function GameOverModal({ gameOverData, onStartNewGame }) {
  const isWin = gameOverData.won;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <div
            className={`game-result-icon ${isWin ? "win-icon" : "lose-icon"}`}
          >
            {isWin ? "🎉" : "😞"}
          </div>

          <h2 className={`result-title ${isWin ? "win-title" : "lose-title"}`}>
            {isWin ? "You Won!" : "You Lost!"}
          </h2>

          <div className="result-details">
            <div className="result-detail">
              <span className="detail-label">Final Sum: </span>
              <span
                className={
                  gameOverData.finalSum >= 0
                    ? "positive-result"
                    : "negative-result"
                }
              >
                {gameOverData.finalSum >= 0
                  ? `+${gameOverData.finalSum}`
                  : gameOverData.finalSum}
              </span>
            </div>

            <div className="result-detail">
              <span className="detail-label">Boxes Revealed: </span>
              {gameOverData.boxesRevealed}
            </div>

            {gameOverData.stoppedEarly && (
              <div className="early-stop-notice">Game stopped early</div>
            )}
          </div>

          <button onClick={onStartNewGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
