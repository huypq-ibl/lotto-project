const bytebuffer = require('bytebuffer')
const request = require('request')
const {
  createContext,
  Signer
} = require('sawtooth-sdk/signing')

const DEFAULT_URL = 'http://139.162.47.17:8008/batches'

function postToValidator(batchListBytes, _url = DEFAULT_URL) {
    request({
      url: _url,
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: batchListBytes
    }, (err, response, body) => {
      if (err) {
        console.log('post error: ' + err);
      } else console.log('response: ' + JSON.stringify(response))
    })
}

function processFile(inputFile) {
    var result = [];
    var fs = require('fs'),
      readline = require('readline'),
      instream = fs.createReadStream(inputFile),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream);
  
    rl.on('line', function (line) {
      result.push(line);
      // console.log(result.length);
      // console.log(line);
    });
  
    rl.on('close', async function (line) {
      //console.log(line);
      console.log('done reading file.');
    });
  
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(result);
      }, 100);
    })
}

async function postToServer(fileName, url, numberTxPerSec) {
    var batchList = await processFile(fileName);
    let n = (numberTxPerSec < batchList.length) ? numberTxPerSec : batchList.length;

    for (i = 0; i < n; i++) {
      postToValidator(
        bytebuffer.fromHex(batchList[i]).buffer,
        url
      )
    }
}