import WebSocket, { Server as WebSocketServer, Data } from 'ws';

class WebsocketHelper {
    private wsServer: WebSocketServer;

    constructor(port: number) {
        this.wsServer = new WebSocket.Server({ port });

        this.wsServer.on('connection', (ws: WebSocket) => {
            console.info('Client connected to websocket');
            ws.send('Connected to websocket');
            ws.on('message', (message: Data) => {
                console.info(`Received message: ${message}`);
            });
            ws.on('close', () => {
                console.info('Client disconnected to websocket');
            });
        });
    }

    // Send message to every clients
    public broadcast(message: string) {
        this.wsServer.clients.forEach((client: any) => {
            if (client.readyState === WebSocket.OPEN)
                client.send(message);
        });
    }
}

export default WebsocketHelper;
