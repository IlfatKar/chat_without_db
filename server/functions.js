const parse = (str) => {
  const tmp = JSON.parse(str);
  let res = null;
  switch(tmp.action){
      case 'SEND':
        res = {
          type: "MESSAGE",
          data: {
            id: tmp.data.id,
            text: tmp.data.text,
            sender: tmp.data.sender,
          }
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


module.exports.parse = parse;