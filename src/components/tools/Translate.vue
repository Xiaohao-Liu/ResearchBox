<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;"  v-loading="loading">
    <el-row style="position:absolute;height:calc(100% - 30px);width:100%;top:30px;left:0px;">
        <el-col :span="12" style="height:100%;">
            <el-container  style="height:100%;">
            <el-header class="title">English</el-header>
            <el-main class="input_b">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="en">
                    </el-input>
            </el-main>
            </el-container>
        </el-col>
        <el-col :span="12"  style="height:100%;">
            <el-container  style="height:100%;">
            <el-header class="title check">
                <div   v-on:click="toEN()"><i class="el-icon-refresh-left" style="margin-right:20px;"></i>简体中文</div>
            </el-header>
            <el-main class="input_b">
                <el-input
                    type="textarea"
                    placeholder="Translation"
                    v-model="cn">
                    </el-input>
            </el-main>
            </el-container>
        </el-col>
    </el-row>
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
// const Loadding = require("../../utils/loadding");
const axios = require("axios");

export default {
  name: 'Translate',

  data(){
    return {
        loading:false,
        "config":config,
        cn:"",
        en:""
    }
  },
  mounted:function(){
    // this.auth_toke= window.localStorage.getItem("jwt_token");
    // if(!this.auth_toke){
    //   window.location.href=config.login_path;
    // }
    // // var that = this;
    // var first_loadding = new Loadding();
    // first_loadding.add_title("初始化");
    // first_loadding.__init__();
    // first_loadding.add_process(
    //     "拉取数据",
    //     function(){

    //     })
    //     first_loadding.start();
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
      toEN:function(){
          var that = this;
          that.loading = true;
          axios.get(
            "https://api.66mz8.com/api/translation.php?info="+that.en,
            ).then(
                returndata=>{
                    console.log(returndata.data)
                    that.cn = returndata.data.fanyi;
                    that.loading = false;
                }
            );
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
    background: #1976D2;
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
