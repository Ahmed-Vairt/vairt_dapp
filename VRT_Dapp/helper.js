/////////// HELPER  ///////////////

var Web3 = require('web3');
var config = require('./config.json');

// SETUP WEB3 OBJECT 
var web3Obj =  function () {
    if (typeof window !== 'undefined' && typeof window.Web3 === 'undefined') {
         window.Web3 = Web3;
    }
    
    const web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(config.network));
    return web3
}

// DEFINE ABI
var setAbi = function (){
    global.abi =[];
    abi.push({
        constant:false,
        inputs:[{name:'_to',type:'address'},{name:'_value',type:'uint256'},{name:'tokenId',type:'uint256'}],
        name:'transfer',
        outputs:[{name:'success',type:'bool'}],
        payable:false,
        constant: false,
        type:'function'
    });

    abi.push({
        inputs:[{name:'_owner',type:'address'},{name:'tokenId',type:'uint256'}],
        name:'balanceOf',
        outputs:[{name:'vrtBalance',type:'uint256'}],
        payable:false,
        constant: true,
        type:'function'
    });
    
    abi.push({
        inputs:[{name:'_ownerVested',type:'address'},{name:'tokenId',type:'uint256'}],
        name:'vestedBalance',
        outputs:[{name:'vestedAmount',type:'uint256'}],
        payable:false,
        constant: true,
        type:'function'
    });


    abi.push({
        inputs:[],
        name:'getOwner',
        outputs:[{name:'ownerAddress',type:'address'}],
        payable:false,
        constant: false,
        type:'function'
    });

    abi.push({
        inputs:[{name:'_to',type:'address'},{name:'_value',type:'uint256'},{name:'tokenId',type:'uint256'}],
        name:'investment',
        outputs:[{name:'success',type:'bool'}],
        payable:false,
        constant: false,
        type:'function'
    });

    abi.push({
        constant:true,
        inputs:[{name:'_from',type:'address'},{name:'_value',type:'uint256'},{name:'tokenId',type:'uint256'}],
        name:'dinvestment',
        outputs:[{name:'success',type:'bool'}],
        payable:false,
        constant: false,
        type:'function'
    });

}
exports.setAbi = setAbi;
exports.web3Obj = web3Obj;

//
// [{"constant":true,"inputs":[{"name":"_owner","type":"address"},
//         {"name":"tokenId","type":"uint256"}],
//     "name":"balanceOf","outputs":[{"name":"vrtBalance","type":"uint256"}],
//     "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":false,"inputs":[{"name":"_to","type":"address"},
//             {"name":"_value","type":"uint256"},
//             {"name":"tokenId","type":"uint256"}],
//         "name":"transfer","outputs":[{"name":"success","type":"bool"}],
//         "payable":false,"stateMutability":"nonpayable","type":"function"},
//     {"constant":true,"inputs":[{"name":"","type":"address"},
//             {"name":"","type":"uint256"}],
//         "name":"vested","outputs":[{"name":"name","type":"string"},
//             {"name":"symbol","type":"string"},
//             {"name":"id","type":"uint256"},
//             {"name":"decimals","type":"uint8"},
//             {"name":"balance","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":true,"inputs":[{"name":"","type":"address"}],
//         "name":"dinvest","outputs":[{"name":"","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":false,"inputs":[{"name":"_from","type":"address"},
//             {"name":"_value","type":"uint256"},
//             {"name":"tokenId","type":"uint256"}],
//         "name":"dinvestment","outputs":[{"name":"success","type":"bool"}],
//         "payable":false,"stateMutability":"nonpayable","type":"function"},
//     {"constant":true,"inputs":[{"name":"","type":"address"}],
//         "name":"investmentReleaseRequest","outputs":[{"name":"investorConsent","type":"bool"},
//             {"name":"investorReleaseValue","type":"uint256"},
//             {"name":"investorTokenId","type":"uint256"},
//             {"name":"tokenOwnerConsent","type":"bool"},
//             {"name":"tokenOwnerReleaseValue","type":"uint256"},
//             {"name":"tokenOwnerTokenId","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"ownerAddress","type":"address"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":false,"inputs":[{"name":"_to","type":"address"},
//             {"name":"_value","type":"uint256"},
//             {"name":"tokenId","type":"uint256"}],
//         "name":"investment","outputs":[{"name":"success","type":"bool"}],
//         "payable":false,"stateMutability":"nonpayable","type":"function"},
//     {"constant":true,"inputs":[{"name":"_investor","type":"address"},
//             {"name":"tokenId","type":"uint256"}],
//         "name":"vestedBalance","outputs":[{"name":"vestedAmount","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],
//         "name":"totalSupply","outputs":[{"name":"_supplyBalance","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"constant":true,"inputs":[{"name":"","type":"address"},
//             {"name":"","type":"uint256"}],
//         "name":"balances","outputs":[{"name":"name","type":"string"},
//             {"name":"symbol","type":"string"},
//             {"name":"id","type":"uint256"},
//             {"name":"decimals","type":"uint8"},
//             {"name":"balance","type":"uint256"}],
//         "payable":false,"stateMutability":"view","type":"function"},
//     {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
//     {"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},
//             {"indexed":false,"name":"_value","type":"uint256"}],
//         "name":"Investment","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},
//             {"indexed":false,"name":"_value","type":"uint256"}],
//         "name":"Dinvestment","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},
//             {"indexed":true,"name":"_to","type":"address"},
//             {"indexed":false,"name":"_value","type":"uint256"}],
//     "name":"Transfer","type":"event"}]