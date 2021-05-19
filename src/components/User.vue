<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-header class="top_bar">
    <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-user"></i>用户管理 </el-col>
    </el-row>
    </el-header>
    <el-card class="paper">
    <el-row style="margin-top:10px;">
      <el-col :span="24">
        <el-upload
  class="avatar-uploader"
  style="text-align:center;margin:5px;"
  :action="config.server_host + '/api/user/uploadsidepic'"
  :show-file-list="false"
  :headers="{Authorization:auth_toke}"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <div class="pic" v-if="imageUrl" :style="{backgroundImage:'url('+imageUrl+')'}"></div>
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
      </el-col>
      <el-col :sm="24">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
                
                <el-collapse>
                  <el-collapse-item title="用户名修改" name="0">
                  <el-form-item label="账号">
                    <el-input type="username" v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-row :gutter="20" style="margin:10px 10%;">
                    <el-col :span="12"><el-button type="primary" v-on:click="set_username()">提交</el-button></el-col>
                    <el-col :span="12"><el-button @click="resetForm('ruleForm')">重置</el-button></el-col>
                </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="密码修改" name="1">
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-row :gutter="10" style="margin:10px 10%;">
                        <el-col :span="12"><el-button type="primary" v-on:click="set_password()">提交</el-button></el-col>
                        <el-col :span="12"><el-button @click="resetForm('ruleForm')">重置</el-button></el-col>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="gitee (照片资源收录)" name="2">
                    <el-form-item label="UserName">
                        <el-input type="text" v-model="ruleForm.github_username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Repos">
                        <el-input type="text" v-model="ruleForm.github_repos" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Token">
                        <el-input type="text" v-model="ruleForm.github_token" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-row :gutter="20" style="margin:10px 10%;">
                        <el-col :span="12"><el-button type="primary" v-on:click="set_github()">提交</el-button></el-col>
                        <el-col :span="12"><el-button @click="resetForm('ruleForm')">重置</el-button></el-col>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="深色模式" name="3">
                    <el-radio v-model="darkmode" label="auto" @change="change_dark_mode">跟随系统</el-radio>
                    <el-radio v-model="darkmode" label="dark" @change="change_dark_mode">深色模式</el-radio>
                    <el-radio v-model="darkmode" label="light" @change="change_dark_mode">浅色模式</el-radio>
                  </el-collapse-item>
                </el-collapse>
                
            </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;text-align:center;" >
      <el-button type="danger" plain @click="logout">登出帐号</el-button>
    </el-row>
    </el-card>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../utils/config");
const Loadding = require("../utils/loadding");
const axios = require("axios");

export default {
    inject:['reload'],
  name: 'User',
  props: {
    msg: String
  },
  data(){
      // var validateName = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请输入账号'));
      //   }else{
      //       callback()
      //   }
      // };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
        
        "config":config,
        imageUrl: config.server_host+"/static/uploads/sidepic.jpg",
        auth_toke:null,
        ruleForm: {
          name:'',
          pass: '',
          checkPass: '',
          github_username:"",
          github_repos:"",
          github_token:"",
        },
        user_info:{},
        rules: {

          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          },
        darkmode:"auto"
    }
  },
  mounted:function(){
    this.auth_toke= window.localStorage.getItem("jwt_token");
    if(!this.auth_toke){
      window.location.href=config.login_path;
    }
    let _darkMode = localStorage.getItem("RSB_darkMode");
    let _darkMode_auto = localStorage.getItem("RSB_darkMode_auto");
    this.darkModeAuto = _darkMode_auto == "false" ? false : true;
    if(this.darkModeAuto){
      this.darkmode = "auto";
    }else{
      if (_darkMode) {
        this.darkmode = _darkMode == "false" ? "light" : "dark";
      }
    }
    var that = this;
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数据",
        async function(){
        var returndata = await axios.get(
            config.server_host + "/api/user/info"
        );
            console.log(returndata)
            that.user_info = returndata.data.data;
            if(that.user_info.github_info == null){
              console.log("no gitee_info was settled.")
            }else{
              that.user_info.github_info = JSON.parse(that.user_info.github_info);
              that.ruleForm.github_username = that.user_info.github_info.username;
              that.ruleForm.github_repos = that.user_info.github_info.repos;
              that.ruleForm.github_token = that.user_info.github_info.token;
            }
            that.ruleForm.name = that.user_info.username;
        
        })
        first_loadding.start();

  },
  methods:{
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      resetForm(formName) {
    this.$refs[formName].resetFields();
    },
    set_username:function(){
      var that = this;
      var loadding = new Loadding();
      loadding.add_title("设置用户名");
      loadding.__init__();
      loadding.add_process(
          "设置用户名",
          async function(){
          await axios.post(
              config.server_host + "/api/user/setusername",
              {username:that.ruleForm.name}
          );

          })
          loadding.start();
    },
    set_password:function(){
      var that = this;
      var loadding = new Loadding();
      loadding.add_title("设置密码");
      loadding.__init__();
      loadding.add_process(
          "设置密码",
          async function(){
          await axios.post(
              config.server_host + "/api/user/setpassword",
              {password:that.ruleForm.pass}
          );

          })
          loadding.start();
    },
    set_github:function(){
      var that = this;
      var loadding = new Loadding();
      loadding.add_title("设置Gitee");
      loadding.__init__();
      loadding.add_process(
          "设置Gitee",
          async function(){
          await axios.post(
              config.server_host + "/api/user/setgithub",
              {username:that.ruleForm.github_username,repos:that.ruleForm.github_repos,token:that.ruleForm.github_token}
          );

          })
          loadding.start();
    },
    logout:function(){
      localStorage.removeItem("jwt_token");
      location.reload();
    },
    change_dark_mode:function(changedValue){
      console.log("change to:", changedValue)
      let darkMode = false;
      if(changedValue=="auto"){
        localStorage.setItem("RSB_darkMode_auto","true");
        darkMode= window.matchMedia('(prefers-color-scheme: dark)').matches;
      }else{
        localStorage.setItem("RSB_darkMode_auto","false");
        if(changedValue=="dark"){
          localStorage.setItem("RSB_darkMode","true");
          darkMode = true;
        }else{
          localStorage.setItem("RSB_darkMode","false");
          darkMode = false;
        }
      }
      $("body").addClass(darkMode?"dark-mode":"");
      $("body").removeClass(!darkMode?"dark-mode":"");    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">

</style>
