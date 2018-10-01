const {
    storeTx
   } = require('./createTransactions')

var entries = [
    ["batchList0.txt", 1000000],
    ["batchList1.txt", 1000000],
    ["batchList2.txt", 1000000],
    ["batchList3.txt", 1000000]
]

// Create batch list (byte) and save to file
var i;
for (i = 0; i < entries.length; i++) {
    storeTx(entries[i][1], entries[i][0]);
    console.log("Save file : " + entries[i][0] + " finish")
}