/////////// TRANFER TOKEN FROM TOKEN OWNER TO OTHER ACCOUNT ///////////////
var helper = require('./helper.js');
var SolidityFunction = require("web3/lib/web3/function");
var lodash = require('lodash');
var transaction = require('./transaction.js');
var abi = require('human-standard-token-abi');

var transferVrt = async function (toAddress, vrtValue , privatekey, trSender , tokenid) {
        let solidityFunction = new SolidityFunction('', lodash.find(abi, { name: 'transfer' }), '');
        var data = solidityFunction.toPayload([toAddress, vrtValue, tokenid]).data;
        console.log("i m here");
        return await transaction.executeTransaction(data , privatekey, trSender);
}

exports.transferVrt = transferVrt;