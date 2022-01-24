const parse = (str) => {
  const tmp = JSON.parse(str);
  let res = null;
  switch(tmp.action){
      case 'SEND':
        res = {
          type: "MESSAGE",
          data: tmp.data
        }
      break;
      case 'REQUEST_MESSAGES':
        res = {
          type: "MESSAGES",
          data: tmp.data,
        }
      break;
      default:
      res = {
        type: 'error',
        message: 'this action not set',
      }
      break;
    }
    return res;
  }

const onlineToAll = (wsServer) => {
  wsServer.clients.forEach((client) => {
      client.send(JSON.stringify({
        type: 'online',
        data: wsServer.clients.size,
      }));
    })
  }

module.exports.parse = parse;
module.exports.onlineToAll = onlineToAll;