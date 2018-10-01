const {
    DEFAULT_URL,
    postToServer
  } = require('./postToServer')

entries = [
    ["batchList0.txt", 'http://139.162.47.17:8008/batches'],
    ["batchList1.txt", 'http://139.162.47.17:8008/batches'],
    ["batchList2.txt", 'http://139.162.47.17:8008/batches'],
    ["batchList3.txt", 'http://139.162.47.17:8008/batches']
]

// Send batchList to server
var i;
for (i = 0; i < entries.length; i++) {
    postToServer(entries[i][0], entries[i][1]);
    console.log("Send file : " + entries[i][0] + " finish");
}
