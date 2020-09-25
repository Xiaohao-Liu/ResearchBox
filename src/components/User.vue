<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-user"></i>用户管理 </el-col>
        </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="6">
        <el-upload
  class="avatar-uploader"
  :action="config.server_host + '/api/user/uploadsidepic'"
  :show-file-list="false"
  :headers="{Authorization:auth_toke}"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <div class="pic" v-if="imageUrl" :style="{backgroundImage:'url('+imageUrl+')'}"></div>
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
      </el-col>
      <el-col :span="18">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                
                <el-collapse>
                  <el-collapse-item title="用户名修改" name="0">
                  <el-form-item label="账号">
                    <el-input type="username" v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-row :gutter="20" style="margin:10px 10%;margin-left:100px;">
                    <el-col :span="12"><el-button type="primary" icon="el-icon-user-solid" v-on:click="set_username()">提交用户名</el-button></el-col>
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
                    <el-row :gutter="20" style="margin:10px 10%;margin-left:100px;">
                        <el-col :span="12"><el-button type="primary" icon="el-icon-user-solid" v-on:click="set_password()">提交密码</el-button></el-col>
                        <el-col :span="12"><el-button @click="resetForm('ruleForm')">重置</el-button></el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                
            </el-form>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// const $ = require("jquery");
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
        },
        rules: {

          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          }
    }
  },
  mounted:function(){
    this.auth_toke= window.localStorage.getItem("jwt_token");
    if(!this.auth_toke){
      window.location.href=config.login_path;
    }
    var that = this;
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数据",
        function(){
        axios.get(
            config.server_host + "/api/user/info"
        ).then(
            returndata=>{
                console.log(returndata)
                that.user_info = returndata.data.data;
                that.ruleForm.name = that.user_info.username;
            }
        );

        })
        first_loadding.start();
    //   var that =this;
    //   var first_loadding = new Loadding();
    // first_loadding.add_title("初始化");
    // first_loadding.__init__();
    // first_loadding.add_process(
    //     "拉取数据",
    //     function(){
    //   $.ajax({
    //         type:"GET",
    //         url: config.server_host + "/api/tag/get",
    //         async:false,
    //         dataType:"json",
    //         success:function(returndata){
    //             that.tags_list = returndata.data;
    //         }
    //     });
    //     })
    //     first_loadding.start();
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
          function(){
          axios.post(
              config.server_host + "/api/user/setusername",
              {username:that.ruleForm.name}
          ).then(
              returndata=>{
                  console.log(returndata)
              }
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
          function(){
          axios.post(
              config.server_host + "/api/user/setpassword",
              {password:that.ruleForm.pass}
          ).then(
              returndata=>{
                  console.log(returndata)
              }
          );

          })
          loadding.start();
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../assets/theme";
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 178px;
    display: block;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
