const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

exports.add = (buffer) =>{
    return new Promise((resolve,reject)=>{
        try {
            ipfs.add(buffer, function (err, files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                } else {
                    resolve(files[0].hash);
                }
            })
        }catch(ex) {
            reject(ex);
        }
    })
}
exports.get = (hash) =>{
    return new Promise((resolve,reject)=>{
        try{
            ipfs.get(hash,function (err,files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                }else{
                    var a1=files[0].content;
                    console.log(a1);
                    resolve(files[0].content);
                }
            })
        }catch (ex){
            reject(ex);
        }
    });
}

exports.getContent = (hash) =>{
    return new Promise((resolve,reject)=>{
        try{
            ipfs.files.cat(hash, function (err, file) {
            if (err || typeof file == "undefined") {
                reject(err);
            }else{
                var a1=file;
                console.log(file.toString('utf8'));
                resolve(file.toString('utf8'));
            }
        });
    }catch (ex){
        reject(ex);
    }
});
}

