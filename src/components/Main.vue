<template>
  <el-container style="height:100%;width:100%;position:absolute;top:0px;left:0px;">
    <el-header class="top_bar">
        <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24">{{title}}</el-col>
        </el-row>
    </el-header>
    <el-container style="height:calc(100% - 20px);background:red;padding:0px;"> 
        <el-aside id="aside_bar" width="200px" >
            <el-row class="menu_top">
                <el-col :span="24">
                    <el-card>
                        <div class="image" v-bind:style="{backgroundImage:'url(https://dss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/forum/crop=0,245,1383,858/sign=5f869109adec08fa324f49e764de115f/a9d3fd1f4134970a98cb259998cad1c8a6865dcf.jpg)'}"/>
                        <el-row style="position: absolute;width: 100%;bottom: 0px;padding: 5px 10px;color: white;line-height: 50px;text-align: left;">
                            <el-col :span="18"  style="text-indent:10px;text-shadow: 0px 0px 5px black;">{{user_info.username}}</el-col>
                            <el-col :span="6">
                                <el-button  style="background: rgba(0,0,0,.2);padding: 10px;font-size: 10px;color: white;border: 0px;    backdrop-filter: blur(10px);box-shadow: 0px 0px 10px -2px black;" v-on:click="$router.push('/user');title='用户管理'" icon="el-icon-edit" circle></el-button>
                            </el-col>
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
const $ = require("jquery");
const config = require("../utils/config");
const Loadding = require("../utils/loadding");

import Vue from "vue";
import VueRouter from 'vue-router';
import User from "./User"
import PaperManager from "./menus/PaperManager";
import PaperEditor from "./menus/PaperEditor";
import TagManager from './menus/TagManager';
import MeetingManager from './menus/MeetingManager';
import PlanManager from './menus/PlanManager';
import PlanEditor from './menus/PlanEditor';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/user', component: User},
    { path: '/papermanager', component: PaperManager, alias:"/" },
    { path: '/papereditor/:md5_title', component: PaperEditor, props:true },
    { path: '/tagmanager', component: TagManager },
    { path: '/meetingmanager', component: MeetingManager },
    { path: '/planmanager', component: PlanManager },
    {path: "/planeditor/:ntime",component:PlanEditor,props:true}
  ]
})



export default {
router:router,
  name: 'Main',
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
      user_info:{},
      isRouterAlive:true,
      aside_left:0,
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
          {
              idx:3,
              title:"计划管理",
              icon:"el-icon-s-order",
              route:"/planmanager"
          },
          {
              idx:4,
              title:"设置",
              icon:"el-icon-setting",
              route:"/setting"
          },
      ]
    }
  },
  mounted:function(){
    var that =this;
      var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数据",
        function(){
      $.ajax({
            type:"GET",
            url: config.server_host + "/api/user/info",
            async:false,
            dataType:"json",
            success:function(returndata){
                console.log(returndata)
                that.user_info = returndata.data;
            }
        });
        })
        first_loadding.start();
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
$head_height:30px;
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
    margin-top: 30px;
}
.top_bar{
    padding: 0px;
    height: 30px !important;
    background: teal;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 20;
    width: calc(100% - 200px);
}  
.title_bar{
    line-height: $head_height;
    font-size:1em;
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
.Loadding_cover{
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 100000;
    transition: ease .5s;
}
.Loadding_board{
    position: fixed;
    top: 40%;
    left: 50%;
    height: auto;
    width: 40%;
    margin-left: -20%;
    background: rgb(255, 255, 255);
    z-index: 100001;
    border-radius: 1em;
    box-shadow: 2px 2px 10px rgba(0,0,0,.1);
}
.Loadding_title{
    height: 1.5em;
    color: black;
    font-size: 1em;
    line-height: 1.5em;
    text-align: center;
    font-weight: bold;
}
.Loadding_bar{
    height: 5px;
    width: calc(10% - 20px);
    margin-left: 10px;
    background: #81C784;
    border-radius: 10px;
    margin: 10px;
}
.Loadding_bar::before{
    content: "";
    height: 5px;
    width: calc(100% - 20px);
    margin-left: 10px;
    background: #e0e0e0;
    border-radius: 10px;
    margin: 10px;
    position: absolute;
    left: 0px;
    top: 1.5em;
    z-index: -1;
}
.Loadding_info{
    height: 1.5em;
    color: #999999;
    font-size: .8em;
    line-height: 1.5em;
    margin: 5px;
    text-align: left;
    text-indent: 10px;
}
</style>
