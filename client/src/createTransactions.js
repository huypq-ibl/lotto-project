const fs = require('fs')
const cbor = require('cbor')
const bytebuffer = require('bytebuffer')
const request = require('request')
const { createHash } = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const {
  createContext,
  Signer
} = require('sawtooth-sdk/signing')
const secp256k1 = require('sawtooth-sdk/signing/secp256k1')

const FAMILY = 'lotto'
const VERSION = '1.0'
const PREFIX = 'a2f2a9'

function makeKeyPair() {
  const context = createContext('secp256k1')
  const privateKey = context.newRandomPrivateKey()
  return {
    public: context.getPublicKey(privateKey).asHex(),
    private: privateKey.asHex()
  }
}

function createBatchListBytes(payload, privateKeyHex, cb) {
  // Create signer
  const context = createContext('secp256k1')
  const privateKey = secp256k1.Secp256k1PrivateKey.fromHex(privateKeyHex)
  const signer = new Signer(context, privateKey)

  payload['Signer'] = signer.getPublicKey().asHex()

  // Create the TransactionHeader
  const payloadBytes = cbor.encode(payload)
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: FAMILY,
    familyVersion: VERSION,
    inputs: [PREFIX],
    outputs: [PREFIX],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
  }).finish()

  // Create the Transaction
  const transactionHeaderSignature = signer.sign(transactionHeaderBytes)

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: transactionHeaderSignature,
    payload: payloadBytes
  })

  // Create the BatchHeader
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: [transaction.headerSignature]
  }).finish()

  // Create the Batch
  const batchHeaderSignature = signer.sign(batchHeaderBytes)

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchHeaderSignature,
    transactions: [transaction]
  })

  // Encode the Batch in a BatchList
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  // Submit BatchList to Validator
  return batchListBytes
}

function rand(start, end, numbers) {
  var arr = [];
  let i;
  for (i = 0; i < numbers; i++) {
    arr.push(Math.floor(Math.random() * (end - start) + start));
  }
  return arr;
}

async function storeTx(numberOfTx, fileName) {
  let i = 0
  var batchByte
  for (i = 0; i < numberOfTx; i++) {
    let keypair = makeKeyPair()
    batchByte = createBatchListBytes(
      {
        'Action': 'buy',
        'Value': rand(1, 45, 5)
      },
      keypair['private'],
      success => success ? null : null
    )
    await fs.appendFile(fileName, batchByte.toString('hex') + '\n', (err) => {
      if (err) {
        throw err;
        console.log('Appending file err: ' + err);
      }
    })
  }
  
  return new Promise(function (resole, reject) {
    setTimeout(function() {
       resole(null);
    }, 1);
  })
}
