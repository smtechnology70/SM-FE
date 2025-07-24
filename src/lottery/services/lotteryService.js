import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { WS_BASE_URL } from "../../constant";
import { refreshTokenIfNeeded } from "../../utils/apiClient";

class SignalRService {
  constructor() {
    this.connection = null;
    this.listeners = new Map();
  }

  async connect() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token available");
    }

    refreshTokenIfNeeded();

    this.connection = new HubConnectionBuilder()
      .withUrl(
        `${process.env.REACT_APP_WS_BASE_URL || WS_BASE_URL}/daily-number-game`,
        {
          accessTokenFactory: () => token,
        }
      )
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Set up event handlers
    this.connection.on("GameState", (gameState, personalInfo) => {
      this.notifyListeners("GameState", { gameState, personalInfo });
    });

    this.connection.on("GuessSubmitted", (data) => {
      this.notifyListeners("GuessSubmitted", data);
    });

    this.connection.on("NewWinner", (winner) => {
      this.notifyListeners("NewWinner", winner);
    });

    this.connection.on("GameStatistics", (stats) => {
      this.notifyListeners("GameStatistics", stats);
    });

    this.connection.on("TodaysWinners", (winners) => {
      this.notifyListeners("TodaysWinners", winners);
    });

    this.connection.on("Error", (error) => {
      this.notifyListeners("Error", error);
    });

    try {
      await this.connection.start();
      console.log("SignalR connection established");
      return true;
    } catch (error) {
      console.error("SignalR connection failed:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  // Hub methods
  async joinDailyGame() {
    if (this.connection) {
      await this.connection.invoke("JoinDailyGame");
    }
  }

  async submitGuess(guessedNumber) {
    if (this.connection) {
      await this.connection.invoke("SubmitGuess", guessedNumber);
    }
  }

  async getGameState() {
    if (this.connection) {
      await this.connection.invoke("GetGameState");
    }
  }

  async getTodaysWinners() {
    if (this.connection) {
      await this.connection.invoke("GetTodaysWinners");
    }
  }

  // Event listeners
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  getConnectionState() {
    return this.connection?.state || "Disconnected";
  }
}

export default new SignalRService();
