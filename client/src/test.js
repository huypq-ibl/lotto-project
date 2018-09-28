const {
  storeTx
 } = require('./createTransactions')
 
const {
  DEFAULT_URL,
  postToServer
} = require('./postToServer')

function test(n) {
  x = storeTx(n, "batchList.txt");
  postToServer("batchList.txt", DEFAULT_URL);
}

function autoTest(txPerSec, timePerTest, timeout) {
    stop = setInterval(
      function () {
        test(txPerSec)
      }, timePerTest
    )
    
    setTimeout(()=>{
      clearInterval(stop);
    }, timeout)
    
  }
  
autoTest(+process.argv[2], +process.argv[3], +process.argv[4])
