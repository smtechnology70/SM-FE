import "./GameBoard.css";
import { useSingleGame } from "./contexts/singleGameContext";

export default function GameBoard({ gameState }) {
  const { revealBox } = useSingleGame();

  const handleBoxClick = (index) => {
    if (
      gameState.boxes[index].revealed ||
      gameState.isGameFinished ||
      !gameState.canRevealMore
    ) {
      return;
    }
    revealBox(index);
  };

  return (
    <div className="game-board">
      <h2 className="board-title">Game Board</h2>

      <div className="boxes-grid">
        {gameState.boxes.map((box, index) => (
          <div
            key={index}
            className={`box ${
              box.revealed
                ? box.value >= 0
                  ? "revealed-positive"
                  : "revealed-negative"
                : gameState.isGameFinished || !gameState.canRevealMore
                ? "disabled"
                : "hidden"
            }`}
            onClick={() => handleBoxClick(index)}
          >
            {box.revealed ? (
              <span
                className={box.value >= 0 ? "positive-value" : "negative-value"}
              >
                {box.value >= 0 ? `+${box.value}` : box.value}
              </span>
            ) : (
              <span className="hidden-value">?</span>
            )}
          </div>
        ))}
      </div>

      <div className="board-instructions">
        Click on boxes to reveal their values. You can reveal up to{" "}
        {gameState.maxBoxes} boxes.
      </div>
    </div>
  );
}
