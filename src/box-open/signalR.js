import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../constant";
import { getAccessToken } from "../auth/tokenService";

export const buildConnection = () => {
  const token = getAccessToken();
  return new signalR.HubConnectionBuilder()
    .withUrl(`${WS_BASE_URL}/zero-blast`, {
      withCredentials: true,
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};
