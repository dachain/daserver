var mysql = require('mysql');
var config = require('./config.js')

var pool = mysql.createPool({
    host:config.database.HOST,
    user:config.database.USER,
    password:config.database.PASSWORD,
    database:config.database.DATABASE,
});

var query = (sql,val) => {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
        if (err){
            return resolve(err)
        } else{
            connection.query(sql,val,(err,rows)=>{
            if (err) {
                console.log("发生意外错误："+err.sqlState+ " "+err.message+" "+"sql:"+err.sql);
                reject(err)
            }else{
                resolve(rows)
            }
            connection.release()
    })
   }
  })
 })
}
/*
* https://github.com/wclimb/video-admin/blob/master/lib/sql.js
*
* https://github.com/wclimb/video-admin/blob/master/test/admin-test.js
* */

/*
* apiModel.addAccount(['wclimb','123456']).then(()=>{
			done()
		});
* */
let addAccount = ( value ) => {
    return new Promise((resolve,reject)=>{
        try {
            let _sql = `insert into dm_account set name=?,mobile=?,password=?`
           // console.log(1);
            resolve( query( _sql, value)) ; ;
        }catch(ex) {
                reject(ex);
            }
        });
}

let UpdateIdentityHash =( value ) =>{
    return new Promise((resolve,reject)=>{
    try {
        let _sql = 'update dm_account set identity_hash=? where account_hash=?';
        resolve( query( _sql, value)) ;
    }catch(ex) {
        reject(ex);
    }
});
}
/*
https://github.com/wclimb/video-admin/blob/master/test/admin-test.js
		apiModel.findUser('wclimb').then(function(user) {
		  	var data = JSON.parse(JSON.stringify(user));
		  	console.log(data)
		  	expect(data).to.have.lengthOf(1);
		  	done();
		}).catch((err)=>{
			if (err) {
		       return done(err);
		    }
		})
* */
//查找用户
let findAccount =(value) => {
    return new Promise((resolve,reject)=>{
        var _sql ='' ;
        try {
           _sql ='select * from dm_account where account_hash=?';
        resolve( query( _sql, value)) ;
    }catch(ex) {
            reject(ex);
        }
    });
}

/*
   INSERT INTO dmchain.dm_account
(accountid, account_hash, name, `type`, mobile, password, identity_hash, info_update_status, query_count, login_count,
 login_lasttime, register_date, total_money, rmb_balance, dm_balance, total_score, spend_balance, alert_balance, status, remark)
VALUES(0, '', '', '0', '', '', '', '0', 0, 0, '', CURRENT_TIMESTAMP, 0, 0, '', 0, '', 0, 1, '');

   * */
//奖励代币
let AccountRewardToken = (account_hash,value) => {
    return new Promise((resolve,reject)=>{
        try {
            var _sql = 'update dm_account set dm_balance=dm_balance+'+value+' where account_hash=?';
            resolve( query( _sql, account_hash)) ;
    }catch(ex) {
            reject(ex);
        }
    });
}
//扣除代币
let AccountDeductToken = (account_hash,value) => {
    return new Promise((resolve,reject)=>{
        try {
            var _sql = 'update dm_account set dm_balance=dm_balance-'+value+' where account_hash=?';
            resolve( query( _sql, account_hash)) ;
    }catch(ex) {
            reject(ex);
        }
    });
}
/*
*  addUser,
    deleteUser,
    findAccount,
* */
module.exports = {
    addAccount,
    findAccount,
    UpdateIdentityHash,
    AccountRewardToken,
    AccountDeductToken
}