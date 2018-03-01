let Web3 = require("web3");
let fs = require("fs");
let web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

var iCount = web3.eth.blockNumber;

const printStatus = web3 => () => {
    try {
        const lastBlockNumber = web3.eth.blockNumber;
        const lastBlock = web3.eth.getBlock(lastBlockNumber);
    } catch (err) {
        console.error(chalk.red(err));
    }
};

console.log(iCount);
var a1 = web3.eth.getBalance("0xccfd3e2d7614cf77ebe0a093fb2c63434ddca306");//peers;
console.log(a1);

let log = {
    time: (new Date).getTime(),
    type: "error",
    msg: "数据库连接失败"
};
let str = JSON.stringify(log);
let data = Buffer.from(str).toString('hex');
data = '0x' + data;
console.log(data);
const accounts = web3.eth.accounts;
console.log(accounts);
var account0 = web3.eth.accounts[0];
console.log(account0);

var version = web3.version.network;
console.log(version); // 54
//将数据写入到交易中
let coinbase = "0xccfd3e2d7614cf77ebe0a093fb2c63434ddca306";
let user1 = "0xccfd3e2d7614cf77ebe0a093fb2c63434ddca306";
web3.personal.unlockAccount("0xccfd3e2d7614cf77ebe0a093fb2c63434ddca306", "1234");
let address = web3.eth.sendTransaction({
    from: coinbase,
    to: user1,
    value: '0x0011',
    data: data
});

//从交易地址获取数据
let transaction = web3.eth.getTransaction(address);
let inputData = transaction.input;
let res_str = Buffer.from(inputData.replace('0x', ''), 'hex').toString();
let res_json = JSON.parse(res_str);
console.log(transaction);
console.log(res_json);