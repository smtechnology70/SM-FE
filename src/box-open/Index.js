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
  const [gameId, setGameId] = useState("ROOM1");
  const [player, setPlayer] = useState(null); // player will be set after fetch
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);

  // Fetch player ID from backend
  useEffect(() => {
    fetch("http://localhost:5179/api/Auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Auth/me response:", data);
        setPlayer(Number(data.userId)); // Ensure player is always a number
      })
      .catch(() => setPlayer(null));
  }, []);

  // -- establish hub connection once  --
  useEffect(() => {
    if (player == null) return; // Wait for player ID
    if (conn.state === "Disconnected") {
      conn
        .start()
        .then(() => {
          console.log("Connected to SignalR, player:", player);
          conn.invoke("JoinGame", gameId);
        })
        .catch((err) => console.error("SignalR connection error", err));
    }

    conn.on("State", (s) => {
      console.log("State changed:", s);
      setState(s);
    });
    return () => {
      conn.off("State");
      conn.stop(); // optional cleanup
    };
  }, [player]);

  // -- join a game after connection ready --
  useEffect(() => {
    if (!connected && conn.state === "Disconnected") {
      conn.start().then(() => {
        setConnected(true);
        conn.invoke("JoinGame", gameId);
      });
    }
  }, [conn, connected]);

  // -- play win sound when game ends --
  useEffect(() => {
    if (state?.status === "Finished") audio.win.play();
  }, [state?.status]);

  const handleClick = (idx) => {
    console.log("Box clicked:", idx);
    if (!state) return;
    if (STATUS_MAP[state.status] !== "Playing") return;
    if (state.currentPlayer !== player) return;
    if (state.boxes[idx].revealed) return;

    audio.click.currentTime = 0;
    audio.click.play();
    conn.invoke("Move", gameId, idx);
  };

  if (!state) return <p>Connecting / joining…</p>;

  return (
    <div className="app">
      <h3>
        Game ID: <code>{gameId}</code>
      </h3>

      <p>
        {STATUS_MAP[state.status] === "Playing"
          ? `Turn: Player ${state.currentPlayer}`
          : `Winner: Player ${state.winner}`}
      </p>

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
