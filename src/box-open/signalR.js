import * as signalR from "@microsoft/signalr";

export const buildConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5179/zero-blast", {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
