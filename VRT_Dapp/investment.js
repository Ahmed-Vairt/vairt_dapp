/////////// TRANFER TOKEN FROM TOKEN OWNER TO OTHER ACCOUNT ///////////////
var helper = require('./helper.js');
var SolidityFunction = require("web3/lib/web3/function");
var lodash = require('lodash');
var transaction = require('./transaction.js');
var abi = require('human-standard-token-abi');

var investment = async function (toAddress, investedValue, privatekey, trSender , tokenSymbol) {
    let solidityFunction = new SolidityFunction('', lodash.find(abi, { name: 'investment' }), '');
    var data = solidityFunction.toPayload([toAddress, investedValue, tokenSymbol]).data;
    return await transaction.executeTransaction(data,privatekey, trSender);
}

var dinvestment =async function (fromAddress, dinvestValue, privatekey, trSender, tokenSymbol) {
    let solidityFunction = new SolidityFunction('', lodash.find(abi, { name: 'dinvestment' }), '');
    var data = solidityFunction.toPayload([fromAddress, dinvestValue, tokenSymbol]).data;
    return await transaction.executeTransaction(data,privatekey, trSender);
}

exports.investment = investment;
exports.dinvestment = dinvestment;