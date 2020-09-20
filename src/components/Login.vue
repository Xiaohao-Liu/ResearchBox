<template>
  <el-main>
    <el-row>
      <el-col :span="12" :offset="6" class="board">
      <h1 style="margin-left:10px;">{{ head }}</h1>
      <el-row><el-input v-model="username" placeholder="ACCOUNT"></el-input></el-row>
      <el-row><el-input placeholder="请输入密码" v-model="password" show-password></el-input></el-row>
      <el-row>
        <el-col :span="4" :offset="20">
          <el-button type="primary" icon="el-icon-user-solid" v-on:click="login()">登陆</el-button>
        </el-col>
      </el-row>
    </el-col>
    </el-row>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../utils/config");
export default {
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
      head:"LOGIN",
      username:"",
      password:""
    }
  },
  mounted:function(){},
  methods:{
    login:function(){
      var that =this;
      $.ajax({
          type:"POST",
          url: config.server_host + "/api/user/login",
          async:false,
          data:{"username":that.username,"password":that.password},
          dataType:"json",
          success:function(returndata){
            sessionStorage.setItem("token",returndata.data)
            console.log(returndata);
            location.href=config.server_host + "/page/main?token=" + returndata.data
          }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.board{
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0,0,0,.1);
  border: 1px solid #ddd;
}
.el-row{
  margin:10px;
}
.el-button{
  width: 100%;
}
</style>
