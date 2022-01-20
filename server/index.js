const WebSocket  = require('ws');
const {parse} = require('./functions.js');

const wsServer = new WebSocket.Server({port: 9000});

wsServer.on('connection', (wsClient) => {
  wsClient.on('message', (message) => {
    const res = parse(message);
    if(!res.error){
      wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(res));
      })
    }
  })
  wsClient.on('close', () => {
    wsClient.send('test');
  })
});

