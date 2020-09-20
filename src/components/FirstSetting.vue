<template>
  <el-main>
    <el-row>
      <el-col :span="12" :offset="6" class="board">
        <h1 style="text-align:center;">{{ head }}</h1>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="name">
                    <el-input type="username" v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-row :gutter="20" style="margin:10px 10%;margin-left:100px;">
                    <el-col :span="12"><el-button type="primary" icon="el-icon-user-solid" v-on:click="firstset('ruleForm')">提交</el-button></el-col>
                    <el-col :span="12"><el-button @click="resetForm('ruleForm')">重置</el-button></el-col>
                </el-row>
            </el-form>
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
  data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        }else{
            callback()
        }
      };
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
        head:"Initialization",
        ruleForm: {
          name:'',
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
            name: [
            { validator: validateName, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }   
      };
    },
  mounted:function(){},
  methods:{
    firstset:function(formName){
      var that =this;
      console.log(that.ruleForm)
      that.$refs[formName].validate((valid) => {
          if (valid) {
              $.ajax({
                type:"POST",
                url: config.server_host + "/api/user/first_set",
                async:false,
                data:{"username":that.ruleForm.name,"password":that.ruleForm.pass},
                dataType:"json",
                success:function(returndata){
                    console.log(returndata);
                },
                error:function(err){
                    console.log(err)
                }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
    this.$refs[formName].resetFields();
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
