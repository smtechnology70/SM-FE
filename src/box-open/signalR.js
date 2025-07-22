import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../constant";
import { getAccessToken } from "../auth/tokenService";
import { refreshTokenIfNeeded } from "../utils/apiClient";

export const buildConnection = () => {
  refreshTokenIfNeeded();

  return new signalR.HubConnectionBuilder()
    .withUrl(`${WS_BASE_URL}/zero-blast`, {
      withCredentials: true,
      accessTokenFactory: getAccessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};
