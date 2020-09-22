// const redis = require("redis")
const { exec } = require('child_process');
const config = require("../utils/config")

// var client = redis.createClient(config.redis_port,config.redis_host);

// // 启动redis 并执行相关配置
// console.log('redis_config:',config.cwd+'/src/db/redis.conf')

// // exec('redis-server '+config.cwd+'/src/db/redis.conf', (err, stdout, stderr) => {
// //     if(err) {
// //         console.log(err);
// //         return;
// //     }
// //     console.log(`stdout: ${stdout}`);
// //     console.log(`stderr: ${stderr}`);
// // })
// client.get("RSB_INITED",(err,value)=>{
//     if(err) {console.log(err);return;}
//     if(value== null || value == "false"){
//         init_redis();
//         client.set("RSB_INITED","true",(err)=>{
//             if(err)console.log(err)
//             console.log("inited!");
//         })
//     }
//     else{
//         // pass
//     }
// })

// function init_redis(){
//     //Account
//     var RSB_USER = {
//         username:"",
//         password:"",
//         built:false
//     }
//     client.hmset("RSB_USER",RSB_USER,(err)=>{
//         if(err)console.log(err)
//     })
// }

// const { Sequelize } = require('sequelize');


// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('RSB', 'root', '156321', {
  host: '106.13.145.17',
  dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

try {
await sequelize.authenticate();
console.log('Connection has been established successfully.');
} catch (error) {
console.error('Unable to connect to the database:', error);
}

module.exports = {
    sequelize
  }