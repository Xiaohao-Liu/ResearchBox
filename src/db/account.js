// var { client } = require("./init");
const md5 = require("../utils/md5");

const { Sequelize, DataTypes,Op } = require('sequelize');
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
  github_info:{
    type:DataTypes.TEXT
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
async function init(){await User.sync();}init();

async function  is_built(){
    return (await User.findAll()).length >= 0;
}

async function  set_account(username,password){
    var user = await User.create({
        username:username,
        password:md5(password)
    })
    await user.save()
}

async function  set_username(username){
  var user = await User.findOne();
  user.username=username;
  await user.save()
}
async function  set_password(password){
  var user = await User.findOne();
  user.password=md5(password);
  await user.save()
}

async function  get_account(){
    var user = await User.findOne();
    return user.toJSON();
}

async function set_github_info(github_info){
    var user = await User.findOne();
    user.github_info = JSON.stringify(github_info);
    await user.save()
}
module.exports={
    is_built,
    set_account,
    get_account,
    set_github_info,
    set_username,
    set_password
}