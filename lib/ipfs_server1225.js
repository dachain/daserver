const ipfsFile = require('./ipfsFile');
const fs = require('fs');
/*
http://blog.csdn.net/koastal/article/details/78771932

http://blog.csdn.net/koastal/article/details/78771932
*/
//操作文件
/*
let addPath = "./README.md";//上传文件
let getPath = "./12.25.txt";//下载为 这个文件
let buff = fs.readFileSync(addPath);
fs.writeFileSync("./1111.txt",buff);
ipfsFile.add(buff).then((hash)=>{
 console.log("LICENSE.txt 上传结果：");
    console.log(hash);
    console.log("浏览效果：");
    console.log("http://localhost:8080/ipfs/"+hash);
    console.log("http://ipfs.io/ipfs/"+hash);
    console.log("或执行浏览命令： ipfs block  get "+hash);
    console.log("或执行下载命令： ipfs  get "+hash);

    return ipfsFile.get(hash);
}).then((buff)=>{
    fs.writeFileSync(getPath,buff);
    console.log("file:"+getPath);
}).catch((err)=>{
    console.log(err);
})
*/

var hash="QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V";


ipfsFile.cat(hash).then((fils)=>{
    console.log(fils);

}).catch((err)=>{
    console.log(err);
});

return;
//操作内容
let User = {
    "name":"naruto",
    "age":23,
    "level":"ss"
};
buff = Buffer.from(JSON.stringify(User));
//fs.writeFileSync("./User-json.txt",buff);
ipfsFile.add(buff).then((hash)=>{
 console.log("User 文本 上传结果：");
    console.log(hash);
 console.log("浏览效果：");
    console.log("http://localhost:8080/ipfs/"+hash);
 console.log("http://ipfs.io/ipfs/"+hash);
 console.log("或执行浏览命令： ipfs block get "+hash);
 var aaa=ipfsFile.get(hash).then((bbb)=>{
     console.log(bbb.toString());
 });
console.log(aaa);
    return ipfsFile.get(hash);
}).then((buff)=>{
    let obj = JSON.parse(buff.toString('utf-8'));
    console.log(obj);
}).catch((err)=>{
    console.log(err);
})
