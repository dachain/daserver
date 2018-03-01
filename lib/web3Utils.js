/*
*https://github.com/ConsenSys/eth-lightwallet
* https://github.com/SilentCicero/ethereumjs-accounts
* */
const fs = require('fs')
const Web3 = require('web3')
const web3 = new Web3();
var tokenContract;

exports.init = () => {
    web3.setProvider(new web3.providers.HttpProvider("http://192.168.0.133:8545"));
}
exports.getEthBalance = (address) => {
    if (address == null) {
        address = web3.eth.accounts[0];
    }
    var balance = web3.eth.getBalance(address);
    console.log(address + " balance=" + balance);
    return balance;
}

exports.getBalance = (address) => {
    var balance = tokenContract.balanceOf(address);
    console.log("address:" + address + "  balance:" + balance);
    return balance;
}

exports.loadContract = () => {
    var abi = fs.readFileSync("bin/DAChainToken.abi");//StandardToken.abi
    var contract = web3.eth.contract(JSON.parse(abi))

    tokenContract = contract.at("0x7c7c9e5771fe204ef562a1a93b1ccacd2da2e5b3");
    return tokenContract;
}

//加载增发代币合约
exports.loadAddContract = () => {
    var abi = fs.readFileSync("bin/DAChainToken.abi");
    var contract = web3.eth.contract(JSON.parse(abi))
    tokenContract = contract.at("0x8fd062029ef96780e23ec3b8bccfeca843a05362");
    console.log("name:" + tokenContract.name());
    console.log("symbol:" + tokenContract.symbol());
    console.log("totalSupply:" + tokenContract.totalSupply().toString());
    console.log("owner:" + tokenContract.owner());

    var ownerbalance = tokenContract.balanceOf(tokenContract.owner());
    console.log("ownerbalance:" + ownerbalance);

    return tokenContract;
}

//增发代币
exports.addToken = (add_address, add_num) => {
    var account = "0x142536b6ea6cb4e482e79bc0ff87de2d4c5db089";
    try {
        web3.personal.unlockAccount(account, "123456", 100);
    } catch (e) {
        console.log(e);
        return;
    }
    transactionObject = {from: account, gas: 3000000};//
    var result2 = tokenContract.mintToken.sendTransaction(add_address, add_num, transactionObject);
    console.log(result2);
    var event = tokenContract.Transfer(account, add_address, add_num, transactionObject, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    event.watch(function (error, result) {
        if (!error) {
            console.log("======addToken " + add_address + " success");
            console.log(result);
        }
    });
    return tokenContract;
}

//销毁合约
exports.destoryCon = () => {
    var account = "0x142536b6ea6cb4e482e79bc0ff87de2d4c5db089";
    try {
        web3.personal.unlockAccount(account, "123456", 100);
    } catch (e) {
        console.log(e);
        return;
    }
    transactionObject = {from: account, gas: 3000000};
    var result2 = tokenContract.kill.sendTransaction(transactionObject);
    console.log(result2);
    console.log("destory contract");

}

exports.Transfer = (_to, value) => {
    if (value == undefined || value <= 0) {
        value = 1000;
    }

    var transactionObject = {from: "0x142536b6ea6cb4e482e79bc0ff87de2d4c5db089", gas: 3000000};
    var result3 = tokenContract.transfer.sendTransaction(_to, value, transactionObject);//,{value: 200, gas: 2000}  // web3.toWei(1, "ether")
    console.log(result3) // 返回交易 hash

    // watch for changes
    var event = tokenContract.Transfer(web3.eth.accounts[1], _to, value, transactionObject, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    event.watch(function (error, result) {
        if (!error) {
            console.log(result);
        }
    });
    if (result3 != null) {
        return true;
    } else {
        return false;
    }
}

exports.RewardToken = (_to, _value) => {
    try {
        web3.personal.unlockAccount("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e", "1234", 100);//0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478 123456
    } catch (e) {
        console.log(e);
        return;
    }
    var account = "0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e";//'0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478'
    transactionObject = {from: account, gas: 3000000};//
    var result2 = tokenContract.transferFrom.sendTransaction('0x142536b6ea6cb4e482e79bc0ff87de2d4c5db089', _to, _value, transactionObject);
    console.log(result2);
    var event = tokenContract.Transfer('0x142536b6ea6cb4e482e79bc0ff87de2d4c5db089', _to, _value, transactionObject, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    event.watch(function (error, result) {
        if (!error) {
            console.log("======RewardToken " + _to + " success");
            console.log(result);
        }
    });
}
exports.DeductToken = (_from, _value) => {
    transactionObject = {from: '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', gas: 3000000};
    var result2 = tokenContract.transferFrom.sendTransaction(_from, '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', _value, transactionObject);
    console.log(result2);
    var event = tokenContract.Transfer(_from, '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', _value, transactionObject, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    event.watch(function (error, result) {
        console.log("========DeductToken=" + _from + "=" + _value + "========");
        if (!error) {
            console.log(result);
        }
    });
}

exports.approve = (_from, _value) => {
    var transactionObject = {from: _from, gas: 3000000};//_from= '0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e'
    var refApprove = tokenContract.approve.sendTransaction("0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478", 30000, transactionObject);
    console.log(refApprove);
}

exports.transferFrom = (_from, _value) => {
    transactionObject = {from: '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', gas: 3000000};
    var result2 = tokenContract.transferFrom.sendTransaction(_from, '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', _value, transactionObject);
    console.log(result2);
    var event = tokenContract.Transfer(_from, '0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', _value, transactionObject, {
        fromBlock: 0,
        toBlock: 'latest'
    });
    event.watch(function (error, result) {
        if (!error) {
            console.log(result);
        }
    });
}
// 可用token
exports.availableBalance = (address) => {
    if (address == "") {
        return 0;
    }
    var ref = tokenContract.availableBalance.sendTransaction(address, transactionObject);
    console.log(ref)
    return ref;
}
//// 查询解锁日期
exports.getReleaseDate = (address) => {
    if (address == "") {
        return 0;
    }
    var ref = tokenContract.getReleaseDate.sendTransaction(address, transactionObject);
    console.log(ref)
    return ref;
}
// 查询锁金额
exports.getLockAmount = (address) => {
    if (address == "") {
        return 0;
    }
    var ref = tokenContract.getLockAmount.sendTransaction(address, transactionObject);
    console.log(ref)
    return ref;
}

// 分配代币并设置锁定期
exports.transferAndSetLockDate = (address, _value, _period) => {
    if (address == "") {
        return 0;
    }
    var ref = tokenContract.transferAndSetLockDate.sendTransaction(address, _value, _period, transactionObject);
    console.log(ref)
    return ref;
}


// 根据地址查义交易记录
exports.getTranstions = (address) => {
    if (address == "") {
        return 0;
    }
    var ref = tokenContract.getTranstions.sendTransaction(address, transactionObject);
    console.log(ref)
    return ref;
}
/*
* http://blog.csdn.net/koastal/article/details/78794275
* 将数据写入到交易中
* */
exports.setTranstionsData2Chain = () => {

    let log = {
        time: (new Date).getTime(),
        type: "error",
        msg: "数据库连接失败"
    };
    let str = JSON.stringify(log);
    let data = Buffer.from(str).toString('hex');
    data = '0x' + data;

//将数据写入到交易中
    let coinbase = "0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e";
    let user1 = "0x7b8074ad780960baccd69c34acdc43c751736087";
    transactionObject = {from: '0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e', gas: 3000000};
    try {
        web3.personal.unlockAccount("0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e", "1234", 100);//0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478 123456
    } catch (e) {
        console.log(e);
        return;
    }


    let address = web3.eth.sendTransaction({
        from: coinbase,
        to: user1,
        value: '0x00',
        data: data
    }, transactionObject);
    console.log("setTranstionsData2Chain " + address);

}
exports.getTranstionsData = (address) => {
    address = "0xc6a3f242beff25d2210cd3b84f32deabcc9c50361f0dc5ac6caacd512022c211";
//从交易地址获取数据
    let transaction = web3.eth.getTransaction(address);
    let inputData = transaction.input;
    let res_str = Buffer.from(inputData.replace('0x', ''), 'hex').toString();
    let res_json = JSON.parse(res_str);
    console.log(transaction);
    console.log(res_json);

}
/*
通过交易地址 取得 智能合约地址
https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransactionreceipt
* */
exports.getContractAddressByTransAddress = (address) => {
    address = "0xc6a3f242beff25d2210cd3b84f32deabcc9c50361f0dc5ac6caacd512022c211";//0x6b9c747e38125d67d3c6001086b18aeb5067d4eb7b9721463ec6efa6a3749d3f
    var receipt = web3.eth.getTransactionReceipt(address);
    console.log(receipt);
}

//发送已签名的事务
//https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgettransaction
exports.sendRawTransaction = (address) => {
    var msg = web3.sha3('mess5432543253age')
    web3.personal.unlockAccount('0xea7e88f4d05a58a17efd93ca7f6eeb7f6b09d478', '123456', 1000)//time (in seconds)
    var signature = web3.eth.sign(web3.eth.accounts[0], msg);


    address = "0xc6a3f242beff25d2210cd3b84f32deabcc9c50361f0dc5ac6caacd512022c211";//0x6b9c747e38125d67d3c6001086b18aeb5067d4eb7b9721463ec6efa6a3749d3f

    var Tx = require('ethereumjs-tx');
    var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

    var rawTx = {
        nonce: '0x00',
        gasPrice: '0x09184e72a000',
        gasLimit: '0x2710',
        to: '0x0000000000000000000000000000000000000000',
        value: '0x00',
        data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
    }

    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    console.log(serializedTx.toString('hex'));

    var a = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err)
            console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
    });
    return;
}
