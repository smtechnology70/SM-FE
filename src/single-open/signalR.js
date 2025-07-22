import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../constant";
import { getAccessToken } from "../auth/tokenService";

export const buildConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${WS_BASE_URL}/single-number-game`, {
      withCredentials: true,
      accessTokenFactory: getAccessToken,
      // transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};
