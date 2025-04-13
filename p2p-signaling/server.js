const WebSocket = require("ws");
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
        console.log(`✅ Registered: ${from}`);
      }

      if (to && clients[to]) {
        clients[to].send(JSON.stringify({ type, from, payload }));
        console.log(`📤 Relayed ${type} from ${from} to ${to}`);
      }
    } catch (err) {
      console.error("❌ Message handling error:", err.message);
    }
  });

  ws.on("close", () => {
    if (clientId) {
      delete clients[clientId];
      console.log(`❌ Disconnected: ${clientId}`);
    }
  });
});

console.log("🚀 Signaling server is running...");
