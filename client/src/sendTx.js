const {
    DEFAULT_URL,
    postToServer
  } = require('./postToServer')

// Send batchList to server
let filePath = +process[2]
let url = +process.argv[3]
let numberTxPerSec = +process.argv[4]

postToServer(filePath, url, numberTxPerSec);
console.log("Send file : " + filePath + " finish");
