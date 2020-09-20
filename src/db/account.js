var { client } = require("./init");
const md5 = require("../utils/md5");

function is_built(){
    return new Promise((resolve, reject)=>{
        client.hget("RSB_USER","built",(err,value)=>{
            if(err)console.log(err);
            resolve(value)
        })
    })
}

function set_account(username,password){
    var RSB_USER = {
        username:username,
        password:md5(password),
        built:true  
    }
    return new Promise((resolve, reject)=>{
        client.hmset("RSB_USER",RSB_USER,(err)=>{
            if(err)console.log(err)
            resolve(true)
        })
    })
}

function get_account(){    
    return new Promise((resolve, reject)=>{
            client.hgetall("RSB_USER",(err,value)=>{
                if(err)console.log(err);
                resolve(value)
            })
        })
}

module.exports={
    is_built,
    set_account,
    get_account
}