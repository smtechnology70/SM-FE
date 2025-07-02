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
  const [gameId, setId] = useState("ROOM1"); // could be random / form input
  const [player, setP] = useState(1); // 1 or 2 (radio/select)
  const [state, setState] = useState(null); // GameState from server
  const [connected, setConnected] = useState(false);

  // -- establish hub connection once  --
  useEffect(() => {
    if (conn.state === "Disconnected") {
      conn
        .start()
        .then(() => {
          console.log("Connected to SignalR");
          conn.invoke("JoinGame", gameId, player);
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
  }, []);

  // -- join a game after connection ready --
  useEffect(() => {
    if (!connected && conn.state === "Disconnected") {
      conn.start().then(() => {
        setConnected(true);
        conn.invoke("JoinGame", gameId, player);
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
    conn.invoke("Move", gameId, player, idx);
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
