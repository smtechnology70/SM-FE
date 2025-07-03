import * as signalR from "@microsoft/signalr";

export const buildConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5027/zero-blast", {
      withCredentials: true,
    }) // adjust for prod
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
