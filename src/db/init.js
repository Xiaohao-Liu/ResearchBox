const redis = require("redis")
const { exec } = require('child_process');
const config = require("../utils/config")

var client = redis.createClient(config.redis_port,config.redis_host);

// 启动redis 并执行相关配置
console.log('redis_config:',config.cwd+'/src/db/redis.conf')

// exec('redis-server '+config.cwd+'/src/db/redis.conf', (err, stdout, stderr) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
// })
client.get("RSB_INITED",(err,value)=>{
    if(err) {console.log(err);return;}
    if(value== null || value == "false"){
        init_redis();
        client.set("RSB_INITED","true",(err)=>{
            if(err)console.log(err)
            console.log("inited!");
        })
    }
    else{
        // pass
    }
})

function init_redis(){
    //Account
    var RSB_USER = {
        username:"",
        password:"",
        built:false
    }
    client.hmset("RSB_USER",RSB_USER,(err)=>{
        if(err)console.log(err)
    })
}

module.exports = {
    client
  }