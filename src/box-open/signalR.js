import * as signalR from "@microsoft/signalr";
import { WS_BASE_URL } from "../constant";

export const buildConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl(`${WS_BASE_URL}/zero-blast`, {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
