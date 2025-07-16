import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  getAccessTokenExpiration,
  setTokens,
  clearTokens,
} from "../auth/tokenService";
import { API_BASE_URL } from "../constant";

// Refresh token logic
async function refreshTokenIfNeeded() {
  const exp = getAccessTokenExpiration();
  if (!exp || new Date(exp) > new Date()) return;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("No refresh token");
  }

  const res = await axios.post(`${API_BASE_URL}/Auth/refresh`, {
    refreshToken,
  });
  if (res.status !== 200) {
    clearTokens();
    throw new Error("Refresh failed");
  }
  setTokens(res.data);
}

// Generic API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor for token and refresh
apiClient.interceptors.request.use(async (config) => {
  await refreshTokenIfNeeded();
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;

// Usage example:
// import apiClient from "../utils/apiClient";
// apiClient.get("/endpoint");
// apiClient.post("/endpoint", data);
