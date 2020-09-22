var { client } = require("./init");

function insertTable(table){
    var time = new Date().getTime();
    var Table={
        title:table.title,
        Ntime:time,
        list:"",
        process:"0"
    }
    return new Promise((resolve,reject)=>{
        client.hmset("RSB_Learning_Table_"+time,Table,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    }).then(
        res=>{
            return new Promise((resolve,reject)=>{
                    client.hset("RSB_Learning_Tables",time,Table.title,(err)=>{
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
                    client.hdel("RSB_Learning_Tables",ntime,(err)=>{
                        if(err) console.log(err);
                        resolve(true);
                    })
                })
        }
    )
}

function getTablesByNtime(){
    return new Promise((resolve,reject)=>{
        client.hgetall("RSB_Learning_Tables", (err,value)=>{
            if(err) {
                console.log(err);
            }
            resolve(value)
        })
    })
}

function getTablesInfo(ntimes){
    var promise_stack=[];
    for(let i = 0;i < ntimes.length;i++){
        promise_stack[i] = new Promise((resolve,reject)=>{
            client.hgetall("RSB_Learning_Table_"+ntimes[i],(err,value)=>{
                if(err) console.log(err);  
                resolve(value);
            })
        })
    }
    return Promise.all(promise_stack)
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

function put_paper_to_table(ntime,md5_title){
    return new Promise((resolve,reject)=>{
        client.hget("RSB_Learning_Table_"+ntime,"list",(err,value)=>{
            if(err) console.log(err);
            resolve(value);
        })
    }).then(
        md5_title_list=>{
            console.log(md5_title_list)
            if(md5_title_list==""){
                md5_title_list = [];
            }else md5_title_list = md5_title_list.split(";");
            if(md5_title_list.indexOf(md5_title)<0){
                md5_title_list.push(md5_title);
            }else return Promise.resolve(true);
            md5_title_list = md5_title_list.join(";");
            return new Promise((resolve,reject)=>{
                client.hset("RSB_Learning_Table_"+ntime,"list",md5_title_list,(err)=>{
                    if(err) console.log(err);
                    resolve(true);
                })
            })
        }
    )
}

function del_paper_from_table(ntime,md5_title){
    return new Promise((resolve,reject)=>{
        client.hget("RSB_Learning_Table_"+ntime,"list",(err,value)=>{
            if(err) console.log(err);
            resolve(value);
        })
    }).then(
        md5_title_list=>{
            if(md5_title_list==""){
                return Promise.resolve(true);
            }else md5_title_list = md5_title_list.split(";");
            var idx=md5_title_list.indexOf(md5_title);
            if(idx>=0){
                md5_title_list.splice(idx,1)
            }else return Promise.resolve(true);
            md5_title_list = md5_title_list.join(";");
            return new Promise((resolve,reject)=>{
                client.hset("RSB_Learning_Table_"+ntime,"list",md5_title_list,(err)=>{
                    if(err) console.log(err);
                    resolve(true);
                })
            })
        }
    )
}

const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require("./init");

const Plan = sequelize.define('Plan', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // allowNull defaults to true
  },
  nums:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  papers:{
    type: DataTypes.TEXT
  },
  Ntime:{
    type:DataTypes.DATE,
}
}, {
    timestamps: true,
    createdAt:"Ntime",
  // Other model options go here
});
await Meeting.sync();

function insertTable(table){
    var table_ = await Plan.create({
        title:table.title
    });
    return table_.save();
}

function delTable(id){
    var table = await Plan.findByPk(id);
    return await table.destroy();
}

function getTablesByNtime(){
    var tables = await Plan.findAll();
    return tables.toJSON();
}

function getTablesInfo(ids){
    var tables = await Plan.findAll({
        where:{
            id:{
                [Op.or]:ids
            }
        }
    });
    return tables;
}


function del_paper_from_table(paperid,tableid){

    var table = await Plan.findByPk(tableid);
    table.nums = table.nms - 1;

    var paperlist = table.papers.split(';');
    paperlist.splice(indexOf(paperid),1);
    table.papers = paperlist.join(";");
    return await table.save()
}

function put_paper_to_table(paperid, tableid){
    var table = await Plan.findByPk(tableid);
    table.nums = table.nms +1;
    var paperlist = table.papers.split(';');
    paperlist.push(paperid)
    table.papers = paperlist.join(";");
    
    return await table.save()
}

module.exports={
    insertTable,
    delTable,
    getTablesByNtime,
    put_paper_to_table,
    del_paper_from_table,
    getTablesInfo,

}