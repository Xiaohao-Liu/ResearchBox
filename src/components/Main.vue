<template>
  <el-container id="main-app" :class="darkMode?'dark-mode':''"  style="height:100%;width:100%;position:absolute;top:0px;left:0px;">
    
    <el-container style="padding:0px;"> 
        <el-aside id="aside_bar" :class="show_aside?'':'aside_active'" width="200px">
            <el-button  id="menu-btn" :icon="'el-icon-'+(show_aside?'s-fold':'s-unfold')" :style="{left:show_aside?'140px':'0px'}" @click="show_aside=!show_aside" circle></el-button>
            <el-row class="menu_top">
                <el-col :span="24">
                    <el-card>
                        <div class="image" v-bind:style="{backgroundImage:'url('+config.server_host+'/static/uploads/sidepic.jpg)'}"/>
                        <el-row style="position: absolute;width: 100%;bottom: 0px;padding: 5px 10px;color: white;line-height: 50px;text-align: left;">
                            <el-col :span="18"  style="text-indent:10px;text-shadow: 0px 0px 5px black;">{{user_info.username}}</el-col>
                            <el-col :span="6">
                                <el-button  style="background: teal;padding: 10px;font-size: 10px;color: white;border: 0px;box-shadow: 0px 0px 10px -2px black;" v-on:click="$router.push('/user');defaultPageIdx=0;" icon="el-icon-edit" circle></el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class="menu_item" v-for="item in menu" :key="item.idx" v-show="item.idx>0">
                <el-col :span="24">
                    <el-button v-on:click="$router.push(item.route);defaultPageIdx=item.idx;">
                        <i v-bind:class="item.icon"></i> <span>{{item.title}}</span>
                    </el-button>
                </el-col>
            </el-row>
            <div id='dark-mode-control'>
                <el-button :icon="darkMode?'el-icon-moon':'el-icon-sunny'" circle v-on:click="change_mode"></el-button>
                <!-- <div>
                    <div style="font-weight: bold;font-size: 14px;margin-top: 10px;">深色模式</div>
                    <div class="dark-mode-status">{{darkMode?'打开':'关闭'}}</div>
                </div> -->
            </div>
        </el-aside>
        <el-main id="main">
            <router-view v-if="isRouterAlive"></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
// const $ = require("jquery");
const axios = require('axios');
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
import Analysis from './menus/Analysis';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/user', component: User},
    { path: '/papermanager', component: PaperManager, alias:"/" },
    { path: '/papereditor/:id', component: PaperEditor, props:true },
    { path: '/tagmanager', component: TagManager },
    { path: '/meetingmanager', component: MeetingManager },
    { path: '/planmanager', component: PlanManager },
    {path: "/planeditor/:id",component:PlanEditor,props:true},
    {path: "/analysis",component:Analysis}
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
        config:config,
        darkMode:false,
        show_aside:true,
      defaultPageIdx:0,
      user_info:{},
      isRouterAlive:true,
      aside_left:0,
      menu_indexOf:['user','papermanager','tagmanager','meetingmanager','planmanager','analysis'],
      menu:[
          {
              idx:0,
              title:"用户管理",
              icon:"el-icon-user",
              route:"/user"
          },
          {
              idx:1,
              title:"Paper管理",
              icon:"el-icon-paperclip",
              route:"/papermanager"
          },
          {
              idx:2,
              title:"标签管理",
              icon:"el-icon-price-tag",
              route:"/tagmanager"
          },
          {
              idx:3,
              title:"会议管理",
              icon:"el-icon-receiving",
              route:"/meetingmanager"
          },
          {
              idx:4,
              title:"计划管理",
              icon:"el-icon-s-order",
              route:"/planmanager"
          },
          {
              idx:5,
              title:"统计分析",
              icon:"el-icon-data-analysis",
              route:"/analysis"
          },
      ]
    }
  },
  mounted:function(){
    var that =this;
    that.defaultPageIdx = that.menu_indexOf.indexOf(location.hash.substring(2).split("/")[0]);
    axios.interceptors.request.use(request => {
    const jwt_token = window.localStorage.getItem('jwt_token');
    var _darkMode = localStorage.getItem('RSB_darkMode');
    if(_darkMode){
        this.darkMode = _darkMode=="false"?false:true;
    }else{
        localStorage.setItem("RSB_darkMode",this.darkMode);
    }
    var _show_aside = localStorage.getItem('RSB_show_aside');
    if(_show_aside){
        this.show_aside = _show_aside=="false"?false:true;
    }else{
        localStorage.setItem("RSB_show_aside",this.show_aside);
    }
    if (jwt_token) {
    // 此处有坑，下方记录
    request.headers['Authorization'] =`${jwt_token}`;
    }
    return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
    response => {
    if (response.data.token) {
        console.log('jwt_token:', response.data.token);
        window.localStorage.setItem('jwt_token', response.data.token);
    }
    return response;
    },
    error => {
    const errRes = error.response;
    if (errRes.status === 401) {
        window.localStorage.removeItem('jwt_token');
        window.location.href = config.login_path;
    }
    return Promise.reject(error.message);   // 返回接口返回的错误信息
    });
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
            }
        );

        })
        first_loadding.start();
  },
  methods:{
    reload:function(){
        this.isRouterAlive=false;
        this.$nextTick(function(){
            this.isRouterAlive=true;
        })
    },
    change_mode:function(){
        this.darkMode = !this.darkMode;
        localStorage.setItem("RSB_darkMode",this.darkMode);
    },
    change_show_aside:function(){
        this.show_aside = !this.show_aside;
        localStorage.setItem("RSB_show_aside",this.show_aside);
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
    transition:ease .5s;
}
#menu-btn{
background: teal !important;
    padding: 10px;
    font-size: 10px;
    color: white;
    border: 0px !important;
    box-shadow: black 0px 0px 10px -2px;
    transition: ease .5s;
    margin: 10px;
        position: fixed;
    z-index: 1001;
}
.top_bar{
    height: 50px !important;
    background: transparent;
    color: black;
    position: relative;
    top: 0px;
    left: 0px;
    z-index: 0;
    margin: 0px;
    padding: 0px;
    margin-bottom: 15px;
}  
.title_bar{
        line-height: 30px;
    font-size: 1.5em;
    color: black;
    font-weight: bold;
    margin: 10px;
}
#aside_bar{
    width: 200px;
    background: white;
    box-shadow: 4px 0px 10px rgba(0,0,0,.1);
    position: relative;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 100;
    transition:ease .5s;
}

.image{
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
}
.menu_top{
    height: auto;
    overflow: hidden;
}
.menu_top .el-card{
    margin: 0px;
    margin-bottom: 10px;
    border:0px !important;
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
    overflow: hidden;
    cursor: pointer;
    text-align: center;
    padding:10px;
        width: calc(100% - 20px);
        line-height: 20px;
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
#dark-mode-control{
    position: absolute;
    z-index: 101;
    left: 0px;
    text-align: center;
    color:black;
    bottom: 0px;
    width: 100%;
    margin-bottom: 10px;
    padding: 0px;
    box-sizing: border-box;
    overflow: hidden;
    .el-button{
        background: #F9A825;
        border:0px;
        transition:ease .5s;
        i{
            font-size: 20px;
            color: white;
            font-weight: bold;
        }
    }
    .dark-mode-status{
        font-size:12px;
        color:black;
    }
}
.aside_active{
    width:50px !important;
    .menu_top {
        height: 0px;
        margin-bottom: 160px !important;
    }
    .menu_item .el-button{
        margin: 2px 2px;
        width: 45px;
        span i{
            float:none;
        }
        span span{
            display: none;
        }
    }
    #dark-mode-control{
            padding: 0px;
            button{
                    width: 50px;
                    border-radius: 0px;
    margin-left: 0px;
            }
            div{
                display:none;
            }
    }
    #menu-btn{
    margin: 0;
    border-radius: 0px;
    width: 50px;
    height: 50px;
    font-size: 16px;
    }
}
// dark-mode
$dark-mode-bg:#222;
$dark-mode-font-color:#EEE;
#main-app.dark-mode{
    #main{
        background:$dark-mode-bg;
    }
    #dark-mode-control{
        color:#eee;
        .el-button{
            background: #333;
        }
        .dark-mode-status{
            color:#eee;
        }
    }
    .top_bar{
        color: $dark-mode-font-color;
    }  
    .title_bar{
        color: $dark-mode-font-color;
    }
    #aside_bar{
        background: $dark-mode-bg;
        box-shadow: 2px 0px 0px #343434;
    }

    .menu_item .el-button{
        border: 1px solid #343434;

        background: rgba(255,255,255,.2);
        color: $dark-mode-font-color;
    }

    .Loadding_board{
        background: $dark-mode-bg;
    }
    .Loadding_title{
        color: $dark-mode-font-color;
    }
}

</style>
