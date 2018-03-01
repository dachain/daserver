//const Web3 = require('../ethereum/node_modules/web3/index.js')
const fs = require('fs')
const path = require('path')
//const solc = require('solc')
const Web3 = require('web3')
const web3 = new Web3();
var tokenContract ;
    /*
    web3.eth.sendTransaction({data: code}, function(err, transactionHash) {
        if (!err)
            console.log(transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
    });
    */
exports.init = ()=>{

    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

}
exports.getBalance = (address)=>{
 if(address==null){
     address=web3.eth.accounts[0];
 }
    var balance = web3.eth.getBalance(address);
    console.log(balance);
    return balance;
}

//const config = require('../ethereum/config')
//var Tx = require('../ethereum/node_modules/ethereumjs-tx/index.js')
//const key = require('./key')

//const keth = require('../ethereum/node_modules/keythereum/index.js')
exports.loadContract = ()=>{
    var abi = fs.readFileSync("bin/DMToken.abi");//StandardToken.abi
    var contract = web3.eth.contract(JSON.parse(abi))

//var instance = require('../build/contracts/StandardToken.json')

      tokenContract = contract.at("0x89855b4a39cb6a175ca8a24ed625b615cd982cc4")//instance.contract 0x5d7a6a34415ef2ab798d62c07caf87ca98ca7b1f
    /*
    Running migration: 1_initial_migration.js
    Replacing StandardToken...
    ... 0x57ef62262f0ef8e37a00b4e35dc850e600d370b27f96cc2e816f40b3b0223139
    StandardToken: 0x5d7a6a34415ef2ab798d62c07caf87ca98ca7b1f
    */
    var ownerbalance=tokenContract.balanceOf("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e");
    console.log("0:"+ownerbalance);
    ownerbalance=tokenContract.balanceOf("0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b");
    console.log("2:"+ownerbalance);
    return tokenContract;
}
exports.Transfer = (_to,value)=>{
if(value==undefined||value<=0){value=1000;}
if(_to==undefined){
    _to='0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b';
}
    var transactionObject = {from: web3.eth.accounts[0],gas: 3000000};
    var result3 = tokenContract.transfer.sendTransaction(_to,value,transactionObject);//,{value: 200, gas: 2000}  // web3.toWei(1, "ether")
    console.log(result3) // 返回交易 hash

// watch for changes
    var event = tokenContract.Transfer(web3.eth.accounts[0],_to,value,transactionObject, {fromBlock: 0, toBlock: 'latest'});
    event.watch(function(error, result){
        if (!error)
            console.log(result);
    });
    if(result3 !=null){
        return true;
    }else{
        return false;
    }
}
exports.transferFrom = (_from,_value)=>{
    var _to=web3.eth.accounts[0];

    _from="0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b";

    var transactionObject = {from: web3.eth.accounts[0],gas: 3000000};
    var refApprove= tokenContract.approve.sendTransaction(web3.eth.accounts[0],1000,transactionObject);
    console.log(refApprove)
    //tokenContract.transferFrom.call
    var result2 = tokenContract.transferFrom.sendTransaction('0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e','',1000,transactionObject);
  console.log(result2) //
}
/*

var counter = 0;
var callback = function (err, r) {
    counter++;

};

var callback2 = function (err, r) {
    assert.equal(counter, 1);
    assert.equal(r, 11);

};

var batch = web3.createBatch();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
batch.execute();
*/

if(true){
    return;
}

//var name=tokenContract.symbol;
//console.log("3:"+name);

// const destination = "0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b"
// /*we simulate the call to get the payload data which we'll use in the handcrafted transaction*/
// var result = tokenContract.transfer.getData(destination,1000);
// console.log(result);

//var deployer = web3.personal.listAccounts
//console.log("deploying from", deployer)
//web3.personal.unlockAccount('0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e',"1234")
// var BigNumber = require('bignumber.js');

var transactionObject = {from: web3.eth.accounts[0],gas: 3000000};

var refApprove= tokenContract.approve.sendTransaction(web3.eth.accounts[0],1000,transactionObject);
console.log(refApprove)
var result3 = tokenContract.transfer.sendTransaction('0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b',1000,transactionObject);//,{value: 200, gas: 2000}  // web3.toWei(1, "ether")
console.log(result3) // 返回交易 hash
//tokenContract.transferFrom.call
//var result2 = tokenContract.transferFrom.sendTransaction('0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e','0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b',1000,transactionObject);
//console.log(result2) //
// watch for changes
 var event = tokenContract.Transfer(web3.eth.accounts[0],'0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b',1000,transactionObject, {fromBlock: 0, toBlock: 'latest'});
event.watch(function(error, result){
    if (!error)
        console.log(result);
});
/*
// would get all past logs again.
var myResults = event.get(function(error, logs){/!*this is error *!/
    if (!error)
        console.log(logs);
});
*/


/*
var filter = tokenContract.Transfer(web3.eth.accounts[0],'0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b',1000,transactionObject, function (error, result) {
    if (!error)
        console.log(result);


});*/

if(true){
    return;
}
/*
   0xde0fce05649653d0492f18c5178ca8826bf2ffe5b86972d836fdb6cab8e05d32
   0xe267180697a046ce124cb73842b7834d1d3df7505e1be1aec1531ce1f38da5e2
   { address: '0x5d7a6a34415ef2ab798d62c07caf87ca98ca7b1f',
     blockNumber: 7281,
     transactionHash: '0xe267180697a046ce124cb73842b7834d1d3df7505e1be1aec1531ce1f38da5e2',
     transactionIndex: 1,
     blockHash: '0xf239403e4f05be0d4abaaeff8f7e4c5aa8e39415f391aaabb778bfc175bd9b5c',
     logIndex: 1,
     removed: false,

     -----------------
     0x698d8076c227240f372b9e1f5db2d80f23a03693fbe758ff4b2038d9ec6c7912
0x9fe7371701356f40e64b7a243313ec25f20c822e2ee403a8f4e4eece5a9b7892
[]
{ address: '0x5d7a6a34415ef2ab798d62c07caf87ca98ca7b1f',
  blockNumber: 7317,
  transactionHash: '0x9fe7371701356f40e64b7a243313ec25f20c822e2ee403a8f4e4eece5a9b7892',
  transactionIndex: 1,
  blockHash: '0x26f32f4018afbb7a8c5173298493b044543fe035e5a10d4fb06a9845f5bb4887',
  logIndex: 1,
  removed: false,
  event: 'Transfer',
  args:
   { _from: '0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e',
     _to: '0xd3e353c2e81d35f4dbf0cadea9939f9418d8160b',
     _value: { [String: '1000'] s: 1, e: 3, c: [Object] } } }


   * */

//0xd070d120351e6ab8dd80f3349150b2197697fe1371852a30216f02c6b64a151e

//0xd66a9f15bdb93eb39d25391522652c689d55f01ce5f972825ad198b881465162


gasPrice = web3.eth.gasPrice;
gasPriceHex = web3.toHex(gasPrice);
gasLimitHex = web3.toHex(500000);
var sender =  web3.eth.accounts[0];
console.log(tokenContract.totalSupply.toString())



console.log(tokenContract.balanceOf(sender).toString())
console.log(tokenContract.symbol)

tokenContract.setTransform()
//var privateKey = new Buffer(key.key, 'hex')
//var sender = keth.privateKeyToAddress(key.key)
/*
since we build transaction by hand, we need the nonce of the sender account
*/
//tokenContract.balanceOf("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e")
nonce =  web3.eth.getTransactionCount(sender)
nonceHex = web3.toHex(nonce)
console.log("nonce is",nonce,"for",sender,"gasLimit",gasLimitHex,"gasPrice",gasPriceHex)
var rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    to: instance.contract,
    from: sender,
    value: '0x00',
    data: contractData
}

var tx = new Tx(rawTx);
console.log("raw",JSON.stringify(rawTx))

tx.sign(privateKey);

var serializedTx = tx.serialize()
var txhex = serializedTx.toString("hex")
if(txhex.substring(0,3) != '0x')
    txhex = '0x'+txhex
console.log("sendingTX",txhex)
console.log("transaction sent with hash",web3.eth.sendRawTransaction(txhex))

console.log("balance of",sender,"is",tokenContract.balanceOf(key.address).toString(),"of",tokenContract.symbol(),"tokens")





web3.eth.getBlock(2396);// web3.eth.getBlock(2396).transactions  ,web3.eth.getBlock(2396).transactions.length , web3.eth.getBlock(2396).transactions[0]
var info = web3.eth.getBlock(5163);//web3.eth.getBlock(2396).hash
console.log(info);
web3.eth.getBlock("0xb301c5f197de3c5c405623ddab084603f7624b5c3ba6edabd673248a61ca4455");
web3.eth.getCode("0x5d7a6a34415ef2ab798d62c07caf87ca98ca7b1f");//get contract  code by address

var transaction = web3.eth.getTransaction('0x9b1802cd4d8afbcbfbfa6c40bcd1da718cfd6e4725ed5c34b18d40976ee7cfcd');
console.log(transaction);
web3.eth.getBlockTransactionCount("0x9b1802cd4d8afbcbfbfa6c40bcd1da718cfd6e4725ed5c34b18d40976ee7cfcd");//hashStringOrBlockNumber
var balance = web3.eth.getBalance("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e");//web3.eth.getBalance("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e").toString()
console.log(balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
var state = web3.eth.getStorageAt("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e", 0);
console.log(state); // "0x03"
var code = web3.eth.getCode("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e");
console.log(code);
var Trans= web3.eth.getTransactionFromBlock("0xb301c5f197de3c5c405623ddab084603f7624b5c3ba6edabd673248a61ca4455")
console.log(Trans);
var receipt = web3.eth.getTransactionReceipt('0x9b1802cd4d8afbcbfbfa6c40bcd1da718cfd6e4725ed5c34b18d40976ee7cfcd');/*内部包含合约地址*/
console.log(receipt);//0x9b1802cd4d8afbcbfbfa6c40bcd1da718cfd6e4725ed5c34b18d40976ee7cfcd
var number =web3.eth.getTransactionCount("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e");/*qu取得账户的交易数量*/
console.log(number); //