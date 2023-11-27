import WebSocket, { Server as WebSocketServer, Data } from "ws";

class WebsocketHelper {
  private wsServer: WebSocketServer;

  constructor(port: number) {
    this.wsServer = new WebSocket.Server({ port });

    this.wsServer.on("connection", (ws: WebSocket) => {
      console.log("Yeni bir bağlantı kuruldu");

      ws.on("message", (message: Data) => {
        console.log(`Alınan mesaj: ${message}`);
        ws.send(`Gelen mesaj: ${message}`);
      });

      ws.on("close", () => {
        console.log("Bağlantı kapatıldı");
      });
    });
  }

  // Tüm bağlı istemcilere mesaj gönderen metod
  public broadcast(message: string) {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export default WebsocketHelper;
