const WebSocket = require('ws');
const readline = require('readline');

// Set up WebSocket server on a specific port
const port = 4002;
let wss;

try {
  wss = new WebSocket.Server({ port });
  console.log(`WebSocket server is running on ws://localhost:${port}`);
} catch (err) {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try another port.`);
    process.exit(1); // Exit the process if the port is in use
  } else {
    console.error('Error starting WebSocket server:', err);
    process.exit(1);
  }
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('A client connected.');

  // Listen for messages from the client
  ws.on('message', (msg) => {
    console.log(`Message from client: ${msg}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Client: ${msg}`);
      }
    });
  });

  // Notify when a client disconnects
  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

// Handle terminal input for server messages
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  console.log(`Server: ${input}`);
  // Broadcast the server message to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Server: ${input}`);
    }
  });
});
