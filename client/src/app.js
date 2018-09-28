// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz. 
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/app.js
 */
 
'use strict'

const $ = require('jquery')

const {
  getKeys,
  makeKeyPair,
  saveKeys,
  getState,
  submitUpdate,
  postToValidator
} = require('./state')

// Application Object
const app = { user: null, keys: [], assets: [], transfers: [] }

app.refresh = function() {
  console.log('refresh')
}
app.update = function () {
  console.log("####################################")
  test(100);
}

// function test(n) {
//   fs.writeFile('batchList.txt', '');

//   let i = 0
//   for (i = 0; i < n; i++) {
//     let keypair = makeKeyPair()
//     let batchByte = submitUpdate(
//       {
//         'Action':'buy',
//         'Value':[1, 12, 14, 15, 16]
//       },
//       keypair['private'],
//       success => success ? this.refresh() : null
//     )
//     fs.appendFile('batchList.txt', batchByte + '\n', (err) => {
//       if (err) throw err;
//       console.log('appending file err: ' + err)
//     })
//     }

//   // Post toi validator
//   var batchList;
//   fs.readFile('batchList.txt', (err, data) => {
//     if (!err) {
//       batchList = String(data).split("\n")
//     } else {
//       throw err;
//       console.log('Error in reanding file: ' + err);
//     }
//   });

//   for (i = 0; i < batchList.length; i++) {
//     postToValidator(batchList[i])
//   }

// }

// // Create Asset
// $('#createSubmit').on('click', function () {
//   console.log("create Submit");
//   app.update()
// })

app.update()
// Initialize