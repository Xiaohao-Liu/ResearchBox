var { client } = require("./init");

function insertTable(table){
    var time = new Date().getTime();
    var table={
        title:table.title,
        Ntime:time,
        list:[],
        process:""
    }
    return new Promise((resolve,reject)=>{
        client.hmset("RSB_Learning_Table_"+time,table,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    }).then(
        res=>{
            return new Promise((resolve,reject)=>{
                    client.sadd("RSB_Learning_Tables",time,(err)=>{
                        if(err) console.log(err);
                        resolve(true);
                    })
                })
        }
    )
}

function delTable(ntime){
    return new Promise((resolve,reject)=>{
        client.del("RSB_Learning_Table_"+ntime,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    }).then(
        res=>{
            return new Promise((resolve,reject)=>{
                    client.srem("RSB_Learning_Tables",ntime,(err)=>{
                        if(err) console.log(err);
                        resolve(true);
                    })
                })
        }
    )
}

function setTitle(ntime, title){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Learning_Table_"+ntime,"title",title,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
}

function setProcess(ntime, process){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Learning_Table_"+ntime,"process",process,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
}

function setList(ntime, list){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Learning_Table_"+ntime,"list",list,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
}

module.exports={
    insertTable,
    delTable,
    setTitle,
    setProcess,
    setList
}