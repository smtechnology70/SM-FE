import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../constant";
import { getAccessToken } from "../auth/tokenService";

export const buildConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${WS_BASE_URL}/zero-blast`, {
      withCredentials: true,
      accessTokenFactory: getAccessToken,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};
