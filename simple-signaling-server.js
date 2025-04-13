const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let clients = {};

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        const { to, from, type, payload } = data;

        if (type === "register") {
            clients[from] = ws;
        } else if (clients[to]) {
            clients[to].send(JSON.stringify({ from, type, payload }));
        }
    });

    ws.on('close', () => {
        for (const id in clients) {
            if (clients[id] === ws) delete clients[id];
        }
    });
});
