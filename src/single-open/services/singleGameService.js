import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../../constant";
import { getAccessToken } from "../../auth/tokenService";
import { refreshTokenIfNeeded } from "../../utils/apiClient";

class SingleGameService {
  constructor() {
    this.connection = null;
    this.currentGameId = null;

    // Event callbacks
    this.onGameStarted = null;
    this.onGameStateUpdate = null;
    this.onGameOver = null;
    this.onError = null;
  }

  async connect() {
    try {
      refreshTokenIfNeeded();

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${WS_BASE_URL}/single-number-game`, {
          withCredentials: true,
          accessTokenFactory: getAccessToken,
        })
        .withAutomaticReconnect()
        .build();

      this.setupEventListeners();
      await this.connection.start();
      console.log("Connected to SingleGameHub");
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }

  setupEventListeners() {
    if (!this.connection) return;

    this.connection.on("GameStarted", (gameId) => {
      this.currentGameId = gameId;
      this.onGameStarted?.(gameId);
    });

    this.connection.on("GameState", (gameState) => {
      this.onGameStateUpdate?.(gameState);
    });

    this.connection.on("GameOver", (gameOverData) => {
      this.onGameOver?.(gameOverData);
    });

    this.connection.on("Error", (error) => {
      this.onError?.(error);
    });
  }

  async startNewGame() {
    if (!this.connection) throw new Error("Not connected");
    await this.connection.invoke("StartNewGame");
  }

  async revealBox(index) {
    if (!this.connection || !this.currentGameId)
      throw new Error("Not connected or no active game");
    await this.connection.invoke("RevealBox", this.currentGameId, index);
  }

  async stopGame() {
    if (!this.connection || !this.currentGameId)
      throw new Error("Not connected or no active game");
    await this.connection.invoke("StopGame", this.currentGameId);
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.currentGameId = null;
    }
  }

  isConnected() {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const singleGameService = new SingleGameService();
