// var { client } = require("./init");
const md5 = require("../utils/md5");

// function is_built(){
//     return new Promise((resolve, reject)=>{
//         client.hget("RSB_USER","built",(err,value)=>{
//             if(err)console.log(err);
//             resolve(value)
//         })
//     })
// }

// function set_account(username,password){
//     var RSB_USER = {
//         username:username,
//         password:md5(password),
//         built:true  
//     }
//     return new Promise((resolve, reject)=>{
//         client.hmset("RSB_USER",RSB_USER,(err)=>{
//             if(err)console.log(err)
//             resolve(true)
//         })
//     })
// }

// function get_account(){    
//     return new Promise((resolve, reject)=>{
//             client.hgetall("RSB_USER",(err,value)=>{
//                 if(err)console.log(err);
//                 resolve(value)
//             })
//         })
// }
const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require("./init");

const User = sequelize.define('User', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  avatar:{
    type: DataTypes.STRING
  },
  backgrount:{
    type: DataTypes.STRING
  },
  remark:{
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
});
await User.sync();

function is_built(){
    return (await User.findAll()).length >= 0;
}

function set_account(username,password){
    var user = await User.create({
        username:username,
        password:md5(password)
    })
    await user.save()
}

function get_account(){
    var user = await User.findOne();
    return user.toJSON();
}
module.exports={
    is_built,
    set_account,
    get_account
}