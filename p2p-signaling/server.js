serverconst WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

const clients = {};

wss.on("connection", (ws) => {
  let clientId = null;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, from, to, payload } = data;

      if (type === "register") {
        clientId = from;
        clients[from] = ws;
        console.log(`Registered: ${from}`);
      }

      if (to && clients[to]) {
        clients[to].send(JSON.stringify({ type, from, payload }));
      }
    } catch (e) {
      console.error("Failed to handle message:", e.message);
    }
  });

  ws.on("close", () => {
    if (clientId && clients[clientId]) {
      delete clients[clientId];
      console.log(`Disconnected: ${clientId}`);
    }
  });
});

console.log("✅ Signaling server running");
