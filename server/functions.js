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


module.exports.parse = parse;