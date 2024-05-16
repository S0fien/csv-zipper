import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 5599 });

server.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  console.log('WS Server is now up 🌈');
});

export default server;
