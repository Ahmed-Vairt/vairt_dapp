'use strict'
const cors = require('cors')
const express = require('express');
const log4js = require('log4js')
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const config = require('./config.json');
const tokenProvider = require('./token.js');
const transferRLT = require('./transferRlt.js');
const investment = require('./investment.js');
const helper = require('./helper.js');
const wallet = require('ethereumjs-wallet');


// Setting up applicationoptions
app.options('*', cors())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Initialize ABI
helper.setAbi()

// helmt to encounter web vulnerabilities 
const helmet = require('helmet')
app.use(helmet())

// Set Logger
const logger = log4js.getLogger('app')

////////////////// Start Server //////////////////////////////////////////
http.createServer(app).listen(80, "35.196.122.247");
console.log('Server Started')

//==================================== END POINTS START HERE =============================

// CREATE ETHEREUM WALLET
// INPUT : PASSPHRASE
// OUTPUT : WALLET INFO JSON
app.get('/create/wallet/:passphrase', async function (req, res) {
  if (req.params.passphrase !== '') {
    let walletObj = await wallet.generate(req.params.passphrase)
    if (walletObj.getAddressString() == '') {
      res.send({ sucess: false, message: 'Unable to create wallet' })
    } else {
      let responseObj = {
        success: true,
        message: "Wallet created successfully!",
        WalletAddress: walletObj.getAddressString(),
        privateKey: walletObj.getPrivateKeyString(),
        keyValueJson: walletObj.toV3(req.params.passphrase)
      }
      res.send(responseObj);
    }
  } else {
    res.send({ sucess: false, message: 'Please provide passphrase to create wallet' })
  }
})

// ASSIGN NUMERIC VALUE TO PROVIDED TOKEN NAME
// INPUT : TOKENNAME , RESPONSE OBJECT
// OUTPUT : TOKEN NUMERIC VALUE
function returnTokenCode(tokenName, res) {
  if (tokenName == 'VRT_Vested') {
    return config.RLT
  }else if (tokenName == 'VRT_NonVested') {
    return config.RMA
  }
  res.send({ success: false, message: 'Please provide valid token name', data: { "transactionID": null } })
}

// GET BALANCE OF ACCOUNT FILTERED BY TOKEN
// INPUT : TOKEN SYMBOL,ACCOUNT ADDRESS
// OUTPUT : BALANCE OF ACCOUNT
app.get('/account/balance/:address/:tokenSymbol', async function (req, res) {
  let token = tokenProvider.token()
  let tokenValue = returnTokenCode(req.params.tokenSymbol, res)
  token.balanceOf.call(req.params.address, tokenValue, function (err, balance) {
    res.send({ success: true, message: '', data: { "balance": balance } })
  })
})

// GET INVESTED BALANCE OF ACCOUNT FILTERED BY TOKEN : MUST BE ALWAYS RLT
// INPUT : TOKEN SYMBOL,ACCOUNT ADDRESS
// OUTPUT : BALANCE OF ACCOUNT
app.get('/account/balance/vested/:address/:tokenSymbol', async function (req, res) {
  let token = tokenProvider.token()
  let tokenValue = returnTokenCode(req.params.tokenSymbol, res)
  token.vestedBalance.call(req.params.address, tokenValue, function (err, balance) {
    res.send({ success: true, message: '', data: { "balance": balance } })
  })
})

// TRANSFER TOKEN
// INPUT : ACCOUNT ADDRESS , VALUE TO BE TRANSFERRED ,
//         TRANSACTION SENDER , TRANSACTION SENDER PRIVATE KEY
// OUTPUT : TRANSACTION ID
app.post('/transfer', async function (req, res) {
  let toAddress = req.body.toAddress
  let tokenValue = req.body.tokenValue
  let trSender = req.body.trSender
  let privatekey = req.body.privatekey
  let tokenSymbol = returnTokenCode(req.body.tokenSymbol, res)
  if (toAddress == '' || tokenValue == '' || privatekey == '' || trSender == '' || tokenSymbol == ''){
    res.send({ success: true, message: 'Kindly provide all required parameters', data: { "transactionID": null } })
  }
  let transactionId = await transferRLT.transferRLT(toAddress, tokenValue, privatekey, trSender, tokenSymbol)
  if (transactionId.success == false) {
    res.send({ success: false, message: transactionId, data: { "transactionID": null } })
  } else {
    res.send({ success: true, message: '', data: { "transactionID": transactionId } })
  }
})


// INVEST TOKEN : ONLY RLT CAN BE INVESTED , HARDWIRED IN THE CALL
// INPUT : ACCOUNT ADDRESS , VALUE TO BE INVESTED ,
//         TRANSACTION SENDER , TRANSACTION SENDER PRIVATE KEY 
// OUTPUT : TRANSACTION ID
app.post('/invest', async function (req, res) {
  let toAddress = req.body.toAddress
  let investedValue = req.body.investedValue
  let privatekey = req.body.privatekey
  let trSender = req.body.trSender
  let tokenSymbol = config.RLT // HARDWIRED
  if (toAddress == '' || investedValue == '' || privatekey == '' || trSender == '' || tokenSymbol == ''){
    res.send({ success: true, message: 'Kindly provide all required parameters', data: { "transactionID": null } })
  }
  let transactionId = await investment.investment(toAddress, investedValue, privatekey, trSender, tokenSymbol)
  if (transactionId.success == false) {
    res.send({ success: false, message: transactionId, data: { "transactionID": null } })
  } else {
    res.send({ success: true, message: '', data: { "transactionID": transactionId } })
  }
})


// D-INVEST TOKEN : ONLY RLT CAN BE D-INVESTED , HARDWIRED IN THE CALL
// INPUT : ACCOUNT ADDRESS , VALUE TO BE D-INVESTED
//         TRANSACTION SENDER , TRANSACTION SENDER PRIVATE KEY 
// OUTPUT : TRANSACTION ID
app.post('/dinvest', async function (req, res) {
  let fromAddress = req.body.fromAddress
  let dinvestValue = req.body.dinvestValue
  let privatekey = req.body.privatekey
  let trSender = req.body.trSender
  let tokenSymbol = 1
  if (fromAddress == '' || dinvestValue == '' || privatekey == '' || trSender == '' || tokenSymbol == ''){
    res.send({ success: true, message: 'Kindly provide all required parameters', data: { "transactionID": null } })
  }
  let transactionId = await investment.dinvestment(fromAddress, dinvestValue, privatekey, trSender, tokenSymbol)
  if (transactionId.success == false) {
    res.send({ success: false, message: transactionId, data: { "transactionID": null } })
  } else {
    res.send({ success: true, message: '', data: { "transactionID": transactionId } })
  }
})


// GET TRANSACTION RECEIPT
// INPUT : TRANSACTION ID
// OUTPUT : RECEIPT PAYLOAD
app.get('/tranasction/:trHash/receipt', async function (req, res) {
  let web3 = helper.web3Obj()
  web3.eth.getTransactionReceipt(req.params.trHash, function (error, result) {
    if (!error) {
      if (result.logs.length > 0) {
        res.send({ success: true, message: '', data: result })
      } else {
        res.send({ success: false, message: 'Transaction executed but no action performed as requested on blockchain', data: result })
      }
    } else {
      res.send({ success: false, message: 'Failed to get receipt againt transactionID : ' + req.params.trHash })
    }
  })
})
//==================================== END POINTS END HERE =============================
