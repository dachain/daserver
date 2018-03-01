var http = require('http');
//url解析模块
var url = require('url');
//文件系统模块
var fs = require("fs");
const ipfsFile = require('./lib/ipfsFile');
var bodyParser = require('body-parser');
//路径解析模块
var path = require("path");
var querystring = require('querystring');
var web3 = require("./lib/web3Utils");
const dbhelper = require('./lib/mysql.js');
exports.doAction = (request, response) => {
    var requestUrl = request.url;
    var reqs = url.parse(requestUrl, true);
    var actname = reqs.query["actname"];
    var account_hash = reqs.query["account_hash"];
    console.log("actname=" + actname);
    console.log("account_hash=" + account_hash);
    console.log("user_name=" + decodeURI(reqs.query["user_name"]));
    account_hash = request.body.account_hash;
    account_hash = "0xd1cc2a7ac904d7f510a9a7a7b54e23ae82671b2e";

    if (actname == "register" || actname == "login") {
        var ref_data = {
            code: 1,
            msg: "成功",
            data: "",
            time: new Date().getTime()
        }
        if (actname == "register") {

            dbhelper.addAccount(['fdsaf', "1280000", '1111']).then((result) => {
                if (typeof(result.insertId) != 'undefined') {
                    console.log('addAccount accountid=' + result.insertId);
                }
                else {
                    console.log('addAccount 发生意外错误: ', 11);
                }
                ref_data.data = {"dm_balance": result.dm_balance, "spend_balance": result.spend_balance};
                ref_data.code = 1;
                console.log(JSON.stringify(result));
                response.end(JSON.stringify(ref_data));
                return;
            }).catch((err) => {
                console.log(err);
                ref_data.data = err;
                ref_data.code = 0;
                response.end(JSON.stringify(ref_data));
                return;
            });
            return;
        }
    }
    if (account_hash == "" || account_hash == undefined) {
        var ref_data = {
            code: 1,
            msg: "失败",
            data: "地址不能为空",
            time: new Date().getTime()
        }
        response.end(JSON.stringify(ref_data));
        return;
    }
    var success = 1;
    var vRef = "";

    if (actname == "putinfo") {
        exports.putContent(request).then((IdentityHash) => {
            if (IdentityHash != undefined) {
                dbhelper.UpdateIdentityHash([IdentityHash, account_hash]).then((result) => {
                    if (result.code != undefined) {
                        console.log(result.message);
                    } else {
                        dbhelper.AccountRewardToken(account_hash, 1000).then((result) => {
                            if (result.code != undefined) {
                                console.log(result.message);
                            } else {
                                web3.init();
                                web3.loadContract();
                                web3.RewardToken(account_hash, 1000);
                                vRef = IdentityHash;
                                console.log(" AccountRewardToken changedRows=" + result.changedRows);
                                response.end(exports.getReturn(success, vRef, vRef));
                                return;
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                        return;
                    }
                }).catch((err) => {
                    console.log(err);
                });
                return;
            } else {
                response.end(exports.getReturn(0, "失败", "" + err));
                return;
            }
        });
        return;
    } else if (actname == "queryinfo") {
        dbhelper.findAccount([account_hash]).then((Record) => {
            if (Record.code != undefined) {
                console.log(result.message);
            } else if (Record.length > 0) {
                var identity_hash = Record[0].identity_hash;
                console.log(Record.length + "  " + identity_hash);
                ipfsFile.getContent(identity_hash).then((content) => {
                    dbhelper.AccountDeductToken(account_hash, 300).then((result) => {
                        if (result.code != undefined) {
                            console.log(result.message);
                        } else {
                            console.log("AccountDeductToken changedRows=" + result.changedRows);
                            console.log(account_hash + " Deduct 500 Token \r\n");
                            console.log("queryinfo result is :\r\n" + content);
                            /* web3.init();
                             web3.loadContract();
                             web3.DeductToken(account_hash, 300);//*/
                            response.end(exports.getBackContent(success, "", content));
                            return;
                        }
                    }).catch((err) => {
                        console.log(err);
                        response.end(exports.getReturn(0, "" + err, ""));
                        return;
                    });
                }).catch((err) => {
                    console.log(err);
                    return;
                })
            } else {
                response.end(exports.getReturn(0, "未查到记录", ""));
                return;
            }
        }).catch((err) => {
            response.end(exports.getReturn(0, "失败", "" + err));
            return;
        });

    } else if (actname == "getbalance") {//(xxx定义: 0=eth查询/1=代币查询/2=锁定期代币查询/)
        var data = request.body;
        /* web3.init();
         web3.loadContract();*/
        vRef = "100" + data.type;
        if (data.type == 0) {
            // vRef = "" + web3.getEthBalance(account_hash);
        } else if (data.type == 1) {
            // vRef = "" + web3.getBalance(account_hash);
        } else if (data.type == 2) {
            // vRef=""+web3.getLockAmount(account_hash);
        } else {
            vRef = '{"eth":"212","dmtoken":"8600","lockamount":"3232"}';
        }
        vRef = '{"eth":"212","dmtoken":"8600","lockamount":"3232"}';
        response.end(exports.getReturn(success, "", JSON.parse(vRef)));
    } else if (actname == "addTotalSupply") {
        var data = request.body;
        console.log(data);
        var add_address = request.body.add_address;
        var add_num = request.body.add_num;
        console.log("add_address=" + add_address);
        console.log("add_num=" + add_num);
        web3.init();
        web3.loadAddContract();
        web3.addToken(add_address, add_num);
        vRef = IdentityHash;
        console.log(" AccountRewardToken changedRows=" + result.changedRows);
        response.end(exports.getReturn(success, vRef, vRef));
    } else if (actname == "destory") {
        console.log("destory contract start");
        web3.init();
        web3.loadAddContract();
        web3.destoryCon();
        console.log("destory contract stop");

        response.end(exports.getReturn(success, vRef, vRef));
    }
    return;
}

exports.getReturn = (code, msg, data) => {
    var ref_data = {
        code: code,
        msg: msg,
        data: data,
        time: new Date().getTime()
    };
    return JSON.stringify(ref_data);
}

exports.getBackContent = (code, msg, data) => {
    if (null != data && '' != data) {
        data = JSON.parse(data);
    }
    var ref_data = {
        code: code,
        msg: msg,
        data: data,
        time: new Date().getTime()
    };
    return JSON.stringify(ref_data);
}
//操作内容
exports.putContent = (request) => {
    return new Promise((resolve, reject) => {
        try {
            var requestUrl = request.url;
            var reqs = url.parse(requestUrl, true);
            var aa = decodeURI(reqs.query["user_name"]);
            var personal = {
                accountid: "1111",
                user_name: decodeURI(reqs.query["user_name"]),
                user_mobile: reqs.query["user_mobile"],
                user_card: reqs.query["user_card"],
                plate_number: decodeURI(reqs.query["plate_number"]),
                opttime: new Date().getTime()
            };
            if (request.body != null) {
                personal = request.body;
            }
            if (personal.user_name != undefined) {
                personal.user_name = decodeURI(personal.user_name);
            }
            if (personal.plate_number != undefined) {
                personal.plate_number = decodeURI(personal.plate_number);
            }

            buff = Buffer.from(JSON.stringify(personal));
            ipfsFile.add(buff).then((hash) => {
                console.log("User 文本 上传结果：");
                console.log(hash);
                resolve(hash);
            }).catch((err) => {
                console.log(err);
                resolve(err);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}
//操作内容
exports.getContent = (hash) => {
    console.log("http://localhost:8080/ipfs/" + hash);
    console.log("http://ipfs.io/ipfs/" + hash);
    console.log("或执行浏览命令： ipfs block get " + hash);

}