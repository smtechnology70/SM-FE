import "./GameStats.css";

export default function GameStats({ gameState }) {
  const getSumClass = (sum) => {
    if (sum > 0) return "positive-sum";
    if (sum < 0) return "negative-sum";
    return "neutral-sum";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Won":
        return "status-won";
      case "Lost":
        return "status-lost";
      default:
        return "status-playing";
    }
  };

  return (
    <div className="game-stats">
      <h2 className="stats-title">Game Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value boxes-revealed">
            {gameState.revealedBoxesCount}
          </div>
          <div className="stat-label">Boxes Revealed</div>
        </div>

        <div className="stat-card">
          <div className="stat-value boxes-remaining">
            {gameState.remainingBoxes}
          </div>
          <div className="stat-label">Boxes Remaining</div>
        </div>

        <div className="stat-card">
          <div className={`stat-value ${getSumClass(gameState.currentSum)}`}>
            {gameState.currentSum >= 0
              ? `+${gameState.currentSum}`
              : gameState.currentSum}
          </div>
          <div className="stat-label">Current Sum</div>
        </div>

        <div className="stat-card">
          <div className={`stat-value ${getStatusClass(gameState.status)}`}>
            {gameState.status}
          </div>
          <div className="stat-label">Status</div>
        </div>
      </div>

      {gameState.status === "Playing" && (
        <div className="current-status">
          <div className="status-text">
            {gameState.currentSum > 0 ? (
              <span className="winning-status">
                ✓ Currently winning! (Positive sum)
              </span>
            ) : (
              <span className="losing-status">
                ✗ Currently losing! (Negative/zero sum)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
