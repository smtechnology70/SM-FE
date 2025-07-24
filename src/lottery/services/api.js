import apiClient from "../../utils/apiClient";

// Daily Number Services
export const dailyNumberService = {
  getTodaysGame: () => apiClient.get("/DailyNumber/today"),
  submitGuess: (guessedNumber) =>
    apiClient.post("/DailyNumber/submit-guess", { guessedNumber }),
  getTodaysWinners: () => apiClient.get("/DailyNumber/winners/today"),
  getRecentGames: (count = 10) =>
    apiClient.get(`/DailyNumber/recent-games?count=${count}`),
};
