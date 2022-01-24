const WebSocket  = require('ws');
const {parse, onlineToAll} = require('./functions.js');

const wsServer = new WebSocket.Server({port: 9000});
let lastConn = null;

wsServer.on('connection', (wsClient) => {
  if(wsServer.clients.size > 1){
    lastConn = wsClient
    const [firstClient] = wsServer.clients;
    firstClient.send(JSON.stringify({
      type: 'REQUEST_MESSAGES',
    }))
  }

  onlineToAll(wsServer)

  wsClient.on('message', (message) => {
    const res = parse(message);
    if(!res.error){
      if(res.type === 'MESSAGE'){
        wsServer.clients.forEach((client) => {
          client.send(JSON.stringify(res));
        })
      } else if(lastConn && res.type === 'MESSAGES'){
        lastConn.send(JSON.stringify(res));
        lastConn = null
      }
    }
  })
  wsClient.on('close', () => {
    onlineToAll(wsServer)
  })
});

