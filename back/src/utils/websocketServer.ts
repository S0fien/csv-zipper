import { WebSocket } from 'ws';

const server = new WebSocket.Server({ port: 5599 });
console.log('WS Server is now up 🌈');

server.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
});

export default server;
