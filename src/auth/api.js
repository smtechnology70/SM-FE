import {
  getAccessToken,
  getRefreshToken,
  getAccessTokenExpiration,
  setTokens,
  clearTokens,
} from "./tokenService";

async function refreshTokenIfNeeded() {
  const exp = getAccessTokenExpiration();
  if (!exp || new Date(exp) > new Date()) return;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("No refresh token");
  }

  const res = await fetch("http://localhost:5179/api/Auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  setTokens(data);
}

export async function authFetch(url, options = {}) {
  await refreshTokenIfNeeded();
  const token = getAccessToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
