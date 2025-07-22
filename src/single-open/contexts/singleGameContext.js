import React, { createContext, useContext, useReducer, useEffect } from "react";
import { singleGameService } from "../services/singleGameService";

const SingleGameContext = createContext();

const initialState = {
  gameState: null,
  isConnected: false,
  isLoading: false,
  error: null,
  gameOverData: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_GAME_STATE":
      return { ...state, gameState: action.payload };
    case "SET_GAME_OVER_DATA":
      return { ...state, gameOverData: action.payload };
    default:
      return state;
  }
}

export function SingleGameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    singleGameService.onGameStarted = (gameId) => {
      console.log("Game started:", gameId);
      dispatch({ type: "SET_GAME_OVER_DATA", payload: null });
    };

    singleGameService.onGameStateUpdate = (gameState) => {
      dispatch({ type: "SET_GAME_STATE", payload: gameState });
    };

    singleGameService.onGameOver = (gameOverData) => {
      dispatch({ type: "SET_GAME_OVER_DATA", payload: gameOverData });
    };

    singleGameService.onError = (error) => {
      dispatch({ type: "SET_ERROR", payload: error });
    };

    return () => {
      singleGameService.onGameStarted = null;
      singleGameService.onGameStateUpdate = null;
      singleGameService.onGameOver = null;
      singleGameService.onError = null;
    };
  }, []);

  const connect = async (accessToken) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      await singleGameService.connect(accessToken);
      dispatch({ type: "SET_CONNECTED", payload: true });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to connect to game server",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const disconnect = async () => {
    await singleGameService.disconnect();
    dispatch({ type: "SET_CONNECTED", payload: false });
    dispatch({ type: "SET_GAME_STATE", payload: null });
    dispatch({ type: "SET_GAME_OVER_DATA", payload: null });
  };

  const startNewGame = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      await singleGameService.startNewGame();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to start new game" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const revealBox = async (index) => {
    try {
      await singleGameService.revealBox(index);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to reveal box" });
    }
  };

  const stopGame = async () => {
    try {
      await singleGameService.stopGame();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to stop game" });
    }
  };

  return (
    <SingleGameContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        startNewGame,
        revealBox,
        stopGame,
      }}
    >
      {children}
    </SingleGameContext.Provider>
  );
}

export function useSingleGame() {
  const context = useContext(SingleGameContext);
  if (context === undefined) {
    throw new Error("useSingleGame must be used within a SingleGameProvider");
  }
  return context;
}
