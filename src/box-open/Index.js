import React, { useEffect, useRef, useState } from "react";
import "./main.css";
import { generateBoxes } from "./utils/generateBoxes";
import clickSound from "./utils/sounds/click.mp3";
import winSound from "./utils/sounds/win.mp3";
import loseSound from "./utils/sounds/lose.mp3";

const Index = () => {
  const [boxes, setBoxes] = useState(generateBoxes());
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [playersSet, setPlayersSet] = useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(0.75);
  // Adjust playback rate for click sound
  //   const [playClick] = useSound(clickSound, {
  //     // playbackRate,
  //     // interrupt: true,
  //     volume: 0.5,
  //     preload: false,
  //   });
  //   const [playWin] = useSound(winSound, {
  //     // playbackRate,
  //     // interrupt: true,
  //     volume: 0.5,
  //     preload: false,
  //   });
  //   const [playLose] = useSound(loseSound, {
  //     // playbackRate,
  //     // interrupt: true,
  //     volume: 0.5,
  //     preload: false,
  //   });

  const clickAudio = useRef(new Audio(clickSound));
  const winAudio = useRef(new Audio(winSound));
  const loseAudio = useRef(new Audio(loseSound));

  useEffect(() => {
    clickAudio.current.volume = 0.5;
    winAudio.current.volume = 0.5;
    loseAudio.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (gameOver && winner !== null) {
      winAudio.current.currentTime = 0;
      winAudio.current.play();
    }
  }, [gameOver, winner]);

  const handleBoxClick = (index) => {
    if (gameOver || boxes[index].revealed) return;

    const updatedBoxes = [...boxes];
    updatedBoxes[index].revealed = true;
    setBoxes(updatedBoxes);

    clickAudio.current.currentTime = 0;
    clickAudio.current.play();

    if (updatedBoxes[index].value === 0) {
      loseAudio.current.currentTime = 0;
      loseAudio.current.play();
      setGameOver(true);
      setWinner(currentPlayer === 1 ? 2 : 1);
    } else {
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    }
  };

  const resetGame = () => {
    winAudio.current.pause();
    loseAudio.current.pause();
    setBoxes(generateBoxes());
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="app">
      {playersSet && (
        <div className="player-info">
          <span className={currentPlayer === 1 ? "active" : ""}>{player1}</span>
          <span>vs</span>
          <span className={currentPlayer === 2 ? "active" : ""}>{player2}</span>
        </div>
      )}
      <div className="game-status">
        {gameOver ? (
          <h2>🏆 {winner === 1 ? player1 : player2} wins!</h2>
        ) : (
          <p>🎯 {currentPlayer === 1 ? player1 : player2}'s turn</p>
        )}
      </div>
      {/* {!playersSet ? (
        <div className="name-entry">
          <input
            placeholder="Player 1 Name"
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <input
            placeholder="Player 2 Name"
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <button onClick={() => setPlayersSet(true)}>Start Game</button>
        </div>
      ) : (
        <>
          <h1>💥 Zero Trap</h1>
          <p>
            {gameOver
              ? `${currentPlayer === 1 ? player2 : player1} wins!`
              : `${currentPlayer === 1 ? player1 : player2}'s turn`}
          </p>
        </>
      )} */}
      <div className="grid">
        {boxes.map((box, index) => (
          <button
            key={box.id}
            className={`box ${box.revealed ? "revealed" : ""} ${
              box.value === 0 && box.revealed ? "zero-box" : ""
            }`}
            onClick={() => handleBoxClick(index)}
            disabled={box.revealed || gameOver}
          >
            <div className="box-inner">
              <div className="box-front">?</div>
              <div className="box-back">{box.value}</div>
            </div>
          </button>
        ))}
      </div>
      {gameOver && (
        <>
          {/* {playWin()} */}
          <button className="reset-btn" onClick={resetGame}>
            🔄 Play Again
          </button>
        </>
      )}
    </div>
  );
};

export default Index;
