<template>
  <el-main>
    <div
    style="background-image: url(https://pc-index-skin.cdn.bcebos.com/hiphoto/58082756008.jpg);position: absolute;top: 0px;left: 0px;width: 100vw;height: 100vh;background-position: top center;background-size: cover;background-repeat: no-repeat;"
    ></div>
    <el-row>
      <el-col :span="12" :offset="6" class="board" style="background:white;">
        <h1 style="margin-left:10px;font-size:14px;">{{ decodeURI(file_path) }}</h1>
        <el-row><el-input placeholder="请输入密码" v-model="password" show-password></el-input></el-row>
        <el-row>
            <el-col :span="6" style="min-width:100px;text-align:center;">
                <el-button icon="el-icon-check" type="primary" v-on:click="getDownload()" style="color:white;">确认并下载</el-button>
            </el-col>
            <el-col :span="18" style="min-width: 100px;color: #F44336;line-height: 40px;font-size: 12px;text-align: right;">
                {{line}}
            </el-col>
      </el-row>
    </el-col>
    </el-row>
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
// const axios = require('axios');
const md5 = require("../../utils/md5")
export default {
  name: 'Download',
  props: {
    msg: String
  },
  data(){
    return {
      head:"LOGIN",
      file_path:"",
      password:"",
      line:""
    }
  },
  mounted:function(){
    var params = window.location.search.substring(1).split("&")
    for(var i in params){
        var item = params[i].split("=")
        if(item[0]=="file"){
            this.file_path = item[1]
            this.file_name = item[1].split('/')[item[1].split('/').length-1]
            break;
        }
    }
  },
  methods:{
      convertRes2Blob:function(response,file_name) {
        // 提取文件名
        const filename = file_name;
        // 将二进制流转为blob
        const blob = new Blob([response.data], { type: 'application/octet-stream' })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
            window.navigator.msSaveBlob(blob, decodeURI(filename))
        } else {
            // 创建新的URL并指向File对象或者Blob对象的地址
            const blobURL = window.URL.createObjectURL(blob)
            // 创建a标签，用于跳转至下载链接
            const tempLink = document.createElement('a')
            tempLink.style.display = 'none'
            tempLink.href = blobURL
            tempLink.setAttribute('download', decodeURI(filename))
            // 兼容：某些浏览器不支持HTML5的download属性
            if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank')
            }
            // 挂载a标签
            document.body.appendChild(tempLink)
            tempLink.click()
            document.body.removeChild(tempLink)
            // 释放blob URL地址
            window.URL.revokeObjectURL(blobURL)
        }
        },
    getDownload:function(){
      // $.ajax({
      //     type:"POST",
      //     url: config.server_host + "/api/user/login",
      //     async:false,
      //     data:{"username":that.username,"password":that.password},
      //     dataType:"json",
      //     success:function(returndata){
      //       console.log(returndata);
      //       location.href=config.server_host + "/main.html?token=" + returndata.data.token;
      //     }
            
      // });
      if(this.password=="")
      {
          this.line="password is empty!"
          return;
      }
      window.open(config.server_host + "/storage/local/download/"+this.file_name+"?path="+this.file_path+"&p="+md5(this.password))
      
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
