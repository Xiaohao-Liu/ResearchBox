<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-takeaway-box"></i>  实验箱 </el-col>
        </el-row>
        <!-- <div>
          <iframe class="frame" :scr="url"></iframe>  
        </div> -->
        <el-card>
          跳转至 <el-link style="font-size:1em;" type="primary" :href="url" target="_blank">{{url}}</el-link>
        </el-card>
      
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
// const Loadding = require("../../utils/loadding");
// const axios = require('axios');

export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
        url:config.exprimentsUrl
    }
  },
  mounted:function(){
      window.open(this.url)
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
