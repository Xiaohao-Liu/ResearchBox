<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;"  v-loading="loading">
      <el-header class="top_bar">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-link"></i>  链接 </el-col>
        </el-row>
      </el-header>
        <!-- <div>
          <iframe class="frame" :scr="url"></iframe>  
        </div> -->
        <el-card  class="paper" v-for="link in links" :key="link.name">
        <el-row :gutter="10">
            <el-col :span="(link.background!=null && link.background!='')?8:0" :xs="24">
                <div v-show="link.background!=null && link.background!=''" class="paper_img" style="border-radius:5px;" :style="{backgroundImage:'url('+link.background+')'}"/>
            </el-col>
            <el-col :span="(link.background!=null && link.background!='')?16:24"  :xs="24">
                <a  class="paper_head" style="cursor:pointer;text-decoration: none;" :href="link.link" target="__blank">
                  <span>{{link.name}}</span>
              </a>
        <div class="meeting" style="font-size:0.8rem;margin:10px;">
            {{link.original_name}}
        </div>
        <el-row>
            <el-col :span="24" style="font-size:0.8rem">
                {{link.description}}
            </el-col>
        </el-row>
        <!-- <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
        </div> -->
      
            </el-col>
        </el-row>
    </el-card>
      
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
// const Loadding = require("../../utils/loadding");
const axios = require('axios');

export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
        loading: false,
        url:config.exprimentsUrl,
        links: []
    }
  },
  mounted:function(){
      this.loading = true
      axios.get(config.server_host + config.links).then(res=>{
          let data = JSON.parse(res.data.data)
          for(var i =0;i< data.length;i++){ 
              this.links.push(data[i]);
          }
          this.loading=false;
      }).catch(()=>{
        this.loading = false;
      })
  },
  methods:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.frame{
        width: calc(80% - 12px);
    margin: 10px 10%;
    float: left;
    position: relative;
    transition: .5s ease;
    box-shadow: 0 8px 42px -8px rgba(0,0,0,.2)!important;
    border-radius: 1em!important;
    overflow: hidden;
    border:1px solid #EEE;
}
.dark-mode .frame{
    border:1px solid #333;
}
</style>
