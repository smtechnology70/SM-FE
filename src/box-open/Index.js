import { useEffect, useState } from "react";
import "./main.css";
import { buildConnection } from "./signalR";
import clickMp3 from "./utils/sounds/click.mp3";
import loseMp3 from "./utils/sounds/lose.mp3";
import winMp3 from "./utils/sounds/win.mp3";
import { STATUS_MAP } from "./constant";

const audio = {
  click: new Audio(clickMp3),
  win: new Audio(winMp3),
  lose: new Audio(loseMp3),
};

export default function OnlineGame() {
  const [conn] = useState(buildConnection);
  const [player, setPlayer] = useState(null); // player will be set after fetch
  const [state, setState] = useState(null);
  const [matchmakingStatus, setMatchmakingStatus] = useState(null);
  const [matchFound, setMatchFound] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Fetch player ID from backend
  useEffect(() => {
    fetch("http://localhost:5179/api/Auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPlayer(Number(data.userId));
      })
      .catch(() => setPlayer(null));
  }, []);

  // -- establish hub connection and matchmaking --
  useEffect(() => {
    if (player == null) return;
    if (conn.state === "Disconnected") {
      conn
        .start()
        .then(() => {
          conn.invoke("JoinMatchmaking");
        })
        .catch((err) => console.error("SignalR connection error", err));
    }

    // Listen for game state updates
    conn.on("State", (s) => {
      setState(s);
    });
    // Listen for matchmaking status
    conn.on("MatchmakingStatus", (status) => {
      setMatchmakingStatus(status);
    });
    // Listen for match found
    conn.on("MatchFound", (gameInfo) => {
      setMatchFound(true);
      setMatchmakingStatus(null);
      setOpponentDisconnected(false);
    });
    // Listen for opponent disconnect
    conn.on("OpponentDisconnected", () => {
      setOpponentDisconnected(true);
    });

    return () => {
      conn.off("State");
      conn.off("MatchmakingStatus");
      conn.off("MatchFound");
      conn.off("OpponentDisconnected");
      conn.stop();
    };
  }, [player, conn]);

  // -- play win sound when game ends --
  useEffect(() => {
    if (state?.status === "Finished") audio.win.play();
  }, [state?.status]);

  const handleClick = (idx) => {
    if (!state) return;
    if (STATUS_MAP[state.status] !== "Playing") return;
    if (
      state.isPlayer1Turn
        ? state.player1Id !== state.currentPlayerId
        : state.player2Id !== state.currentPlayerId
    )
      return;
    if (state.boxes[idx].revealed) return;
    audio.click.currentTime = 0;
    audio.click.play();
    conn.invoke("Move", idx); // No gameId needed
  };

  if (opponentDisconnected)
    return <p>Your opponent has disconnected. Waiting for a new match…</p>;

  if (!matchFound) {
    return (
      <div className="app">
        <h3>Matchmaking…</h3>
        {matchmakingStatus ? (
          <p>
            {matchmakingStatus.message ||
              `In queue… Position: ${matchmakingStatus.position || "?"}`}
          </p>
        ) : (
          <p>Joining matchmaking queue…</p>
        )}
      </div>
    );
  }

  if (!state) return <p>Waiting for game to start…</p>;

  return (
    <div className="app">
      <h3>Online Game</h3>
      <p>
        {state.isPlayer1Turn
          ? state.player1Id === player
            ? "Your turn"
            : "Opponent's turn"
          : state.player2Id === player
          ? "Your turn"
          : "Opponent's turn"}
      </p>
      <p>{STATUS_MAP[state.status]}</p>
      {console.log("State:", state)}
      <p>{state?.winnerPlayerId === player ? "You win!" : "You lose!"}</p>
      <div className="grid">
        {state.boxes.map((b, i) => (
          <button
            key={i}
            className={`box ${b.revealed ? "revealed" : ""} ${
              b.value === 0 && b.revealed ? "zero-box" : ""
            }`}
            onClick={() => handleClick(i)}
            disabled={b.revealed || STATUS_MAP[state.status] !== "Playing"}
          >
            <div className="box-inner">
              <div className="box-front">?</div>
              <div className="box-back">{b.revealed ? b.value : ""}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
