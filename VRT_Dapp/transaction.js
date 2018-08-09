var tx = require('ethereumjs-tx');
var helper = require('./helper.js');
var config = require('./config.json');

var executeTransaction = async function (data, privatekeyParam, account) {
    try {
        
        let web3 = helper.web3Obj();
        web3.eth.defaultAccount = account; // set transaction sender addresss
        let transactionCount = await web3.eth.getTransactionCount(account); // set transaction sender addresss
        
        var block = await web3.eth.getBlock("latest");

        // transaction request
        let transactionData = {
            nonce: '0x' + transactionCount.toString(16),
            gasPrice: config.gasPriceGwei,
            gasLimit: block.gasLimit,
            from: account,
            to: config.tokenAddress,
            value: '0x0',
            data: data
        }

        let privatekey = new Buffer(privatekeyParam, 'hex') ;// get private key
        let transaction = new tx(transactionData); // create transaction object
        transaction.sign(privatekey); // sign the transaction with transaction sender private key
        let serializedTransaction = transaction.serialize(); // serialize to send over network
        return await web3.eth.sendRawTransaction('0x' + serializedTransaction.toString('hex'));
    } catch (e) {
        return { success: false, message: 'There was problem in executing a transaction'+ e };
    }
}

exports.executeTransaction = executeTransaction;






