<template>
  <el-container style="height:100%;width:100%;position:absolute;top:0px;left:0px;">
    <el-header class="top_bar">
        <el-row style="margin:0px;"> 
            <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col>
            <el-col class="title_bar" :span="20">{{title}}</el-col>
        </el-row>
    </el-header>
    <el-container style="height:calc(100% - 50px);background:red;padding:0px;"> 
        <el-aside id="aside_bar" width="200px">
            <el-row class="menu_top">
                <el-col :span="24">
                    <el-card>
                        <div class="image" v-bind:style="{backgroundImage:'url(https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg)'}"/>
                        <el-row style="position: absolute;
    width: 100%;
    bottom: 0px;
    padding: 5px 10px;
    color: white;
    line-height: 50px;
    text-align: left;">
                            <el-col :span="6">
                                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> 
                            </el-col>
                            <el-col :span="18"  style="text-indent:10px;">{{username}}</el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="menu_item" v-for="item in menu" :key="item.idx">
                <el-col :span="24">
                    <el-button v-on:click="$router.push(item.route);title=item.title;">
                        <i v-bind:class="item.icon"></i> {{item.title}}
                    </el-button>
                </el-col>
            </el-row>
        </el-aside>
        <el-main id="main">
            <router-view v-if="isRouterAlive"></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
// const $ = require("jquery");
// const config = require("../utils/config");
import Vue from "vue";
import VueRouter from 'vue-router';
import PaperManager from "./menus/PaperManager";
import PaperEditor from "./menus/PaperEditor";
import TagManager from './menus/TagManager'
import MeetingManager from './menus/MeetingManager'
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/papermanager', component: PaperManager, alias:"/" },
    { path: '/papereditor/:md5_title', component: PaperEditor, props:true },
    { path: '/tagmanager', component: TagManager },
    { path: '/meetingmanager', component: MeetingManager }
  ]
})



export default {
router:router,
  name: 'login',
  props: {
    msg: String
  },
  provide(){
      return {
          reload:this.reload
      }
  },
  data(){
    return {
      title:"Paper管理",
      username:"Arron",
      password:"",
      isRouterAlive:true,
      menu:[
          {
              idx:0,
              title:"Paper管理",
              icon:"el-icon-paperclip",
              route:"/papermanager"
          },
          {
              idx:1,
              title:"标签管理",
              icon:"el-icon-price-tag",
              route:"/tagmanager"
          },
          {
              idx:2,
              title:"会议管理",
              icon:"el-icon-receiving",
              route:"/meetingmanager"
          },
      ]
    }
  },
  mounted:function(){

  },
  methods:{
    reload:function(){
        this.isRouterAlive=false;
        this.$nextTick(function(){
            this.isRouterAlive=true;
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../assets/theme";
$head_height:50px;
#aside_bar .el-row{
    margin:0px;
}
body{           
    padding: 0px;
    margin: 0px;
    position:absolute;
    top:0px;
    left:0px;
    height: 100%;
    width: 100%;
}
#main{
    background:white;
    position: relative;
}
.top_bar{
    padding:5px;
    height: $head_height;
    background:$--color-primary;
}  
.title_bar{
    line-height: $head_height;
    font-size:1.3em;
    text-align: center;
    color: #EEE;
    font-weight:bold;   
}
#aside_bar{
    width: 200px;
    background: white;
    box-shadow: 4px 0px 10px rgba(0,0,0,.1);
    //  position: absolute;
    height: 100%;
    top: 0px;
    left: 0px;
    position: relative;
    z-index: 10;
}

.image{
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
}

.menu_top .el-card{
    margin: 0px;
    margin-bottom: 10px;
    border:1px;
    border-radius: 0px;
}
.menu_top .el-card__body{
    text-align: center;
    height:150px;
    padding:0px;
}
.menu_top i{
    float: left;
    font-size: 1.3em;
    font-weight: bold;
}

$menu_item_h:20px;
.menu_item .el-button{
    margin: 2px 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    cursor: pointer;
    text-align: center;
    padding:10px;
        width: calc(100% - 20px);
}

.menu_item i{
    float: left;
    line-height: $menu_item_h;
    font-size: 1.3em;
    font-weight: bold;
}

</style>
