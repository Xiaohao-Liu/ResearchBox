<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;"  v-loading="loading">
    <el-row style="position:absolute;height:calc(100% - 30px);width:100%;top:30px;left:0px;">
        <el-col :span="12" style="height:100%;">
            <el-container  style="height:100%;">
            <el-header class="title">源数据</el-header>
            <el-main class="input_b">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="source">
                    </el-input>
            </el-main>
            </el-container>
        </el-col>
        <el-col :span="12"  style="height:100%;">
            <el-container  style="height:100%;">
            <el-header class="title check">
                <div   v-on:click="md5Crypto()"> <i class="el-icon-lock" style="margin-right:20px;"></i>MD5加密</div>
            </el-header>
            <el-main class="input_b">
                <el-input
                    type="textarea"
                    placeholder="MD5加密"
                    v-model="md5crypto">
                    </el-input>
            </el-main>
            </el-container>
        </el-col>
    </el-row>
  </el-main>
</template>

<script>
// const config = require("../../utils/config");
// const axios = require("axios");
const md5 = require("../../utils/md5")
export default {
  name: 'Translate',

  data(){
    return {
        loading:false,
        source:"",
        md5crypto:""
    }
  },
  mounted:function(){

  },
  methods:{
      md5Crypto:function(){
          this.md5crypto = md5(this.source)
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.el-header.title{
    height: 30px !important;
    line-height: 30px;
    text-align: center;
    background: transparent;
    margin: 5px 10px;
    border-radius: 10px;
    color: black;
    font-weight: bold;
}
.el-header.title.check{
    background: #FBC02D;
    cursor: pointer;
    color:white;
    transition: ease .5s;
}
.el-header.title.check:hover{
    box-shadow: 2px 2px 5px rgba(0,0,0,.2);
}
.el-main.input_b{
        background: #eee;
    height: calc(100%);
    margin: 5px 5px;
    padding: 0px;
    border-radius: 10px;
    .el-textarea{
        height:100% !important;
        textarea{
            height: 100% !important;
            background: transparent;
            border: 0px;
            font-size: 1.1em;
            font-weight: bold
        }
    }
}
</style>
