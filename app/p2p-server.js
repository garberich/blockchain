const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

//$HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        // Lista de los servidores de web sockets conectados que se conectarán a este
        this.sockets = [];
    };

    // Método que iniciará el servidor
    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });

        // Event Listener. Escucha los mensajes entrantes enviándolos al servidor de websockets
        // Se recibe el socket y se interactúa con él
        server.on("connection", socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    };

    connectToPeers() {
        peers.forEach(peer => {
            //ws://localhost:5001

            const socket = new Websocket(peer);

            // Inmediatamente se recibe el socket debemos crear otro event listener
            // para el evento ya abierto para trabajar este socket porque posiblemente
            // no tengamos el socket en el servidor 5001
            socket.on('open', () => this.connectSocket(socket));

        });
    };

    // Recibe el socket y lo agrega al array de sockets
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.');

        this.messageHandler(socket);

        // Enviamos los mensajes. Para nosotros el mensaje importante es la cadena
        socket.send(JSON.stringify(this.blockchain.chain));
    };

    // Permite enviar un evento al socket relevante conteniendo un string de mensaje
    // vamos a enviar mensajes de eventos a los sockets. Pero de la misma forma necesitamos que los sockets
    // estén preparados para recibir esos mensajes de eventos
    messageHandler(socket) {
        // Como en todo eventHandler cambiamos el método on

        // El primer parámetro representa el evento que queremos controlar. en este caso el evento mensaje enviado por la función sent
        // El segundo parámetro es un callback con un parámetro que es el objeto mensaje
        socket.on('message', message => {

            // La data es un stringfy. Con esto convertimos el objeto JSON en un objeto javascript
            const data = JSON.parse(message);
            console.log('data', data);
        });
    };
}

module.exports = P2pServer;