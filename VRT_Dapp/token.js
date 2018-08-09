/////////// TOKEN CONFIGURATION SETUP ///////////////

var config = require('./config.json');
var helper = require('./helper.js');
var abi = require('human-standard-token-abi');

// Function add custom functions in ERC20ABI JSON
// Get contract on address provided
// Return token
var token =  function () {

    try {
        let web3 = helper.web3Obj();
        web3.eth.defaultAccount = config.adminAccount; // set default account of eth
        let contract = web3.eth.contract(abi).at(config.tokenAddress);
        return contract;
    }
    catch (e) {
        return { success: false, message: 'There was problem in Token'+ e };
    }
}

exports.token = token;