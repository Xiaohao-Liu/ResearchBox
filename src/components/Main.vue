<template>
  <el-container
    id="main-app"
    :class="darkMode?'dark-mode':''"
    style="height:100%;width:100%;position:absolute;top:0px;left:0px;"
  >
    <el-container style="padding:0px;">
      <el-aside id="aside_bar" :class="show_aside?'':'aside_active'" width="200px">
        <el-button
          id="menu-btn"
          :icon="'el-icon-'+(show_aside?'s-fold':'s-unfold')"
          :style="{left:show_aside?'140px':'0px'}"
          @click="change_show_aside"
          circle
        ></el-button>
        <el-row class="menu_top">
          <el-col :span="24">
            <el-card>
              <div
                class="image"
                v-bind:style="{backgroundImage:'url('+config.server_host+'/static/uploads/sidepic.jpg)'}"
              />
              <el-row
                style="position: absolute;width: 100%;bottom: 0px;padding: 5px 10px;color: white;line-height: 50px;text-align: left;"
              >
                <el-col
                  :span="18"
                  style="text-indent:10px;text-shadow: 0px 0px 5px black;"
                >{{user_info.username}}</el-col>
                <el-col :span="6">
                  <el-button
                    style="background: teal;padding: 10px;font-size: 10px;color: white;border: 0px;box-shadow: 0px 0px 10px -2px black;"
                    v-on:click="$router.push('/user');defaultPageIdx=0;"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="menu_item" v-for="item in menu" :key="item.idx" v-show="item.idx>0">
          <el-col :span="24">
            <el-button v-on:click="$router.push(item.route);defaultPageIdx=item.idx;reload()">
              <i v-bind:class="item.icon"></i>
              <span>{{item.title}}</span>
            </el-button>
          </el-col>
        </el-row>
      </el-aside>
      <el-main id="main">
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
    </el-container>

    <div id="dark-mode-control">
      <el-button
        :icon="darkMode?'el-icon-moon':'el-icon-sunny'"
        circle
        v-on:click="change_mode"
      ></el-button>
      <!-- <div>
                <div style="font-weight: bold;font-size: 14px;margin-top: 10px;">深色模式</div>
                <div class="dark-mode-status">{{darkMode?'打开':'关闭'}}</div>
      </div>-->
    </div>
    <div id='float_board' :class="(frame_hidden?'hidden':'')"
    :style="{
      height:float_frames[frame_idx].height,
      minHeight:float_frames[frame_idx].minHeight,
      width:float_frames[frame_idx].width,
      minWidth:float_frames[frame_idx].minWidth
    }"
    >
    <div class="hidden_circle" v-on:click="frame_hidden=false" :style="{backgroundImage:'url('+float_frames[frame_idx].icon+')'}"></div>
      <div class="top_line">
        <div class="dragger_haddle"></div>
        <el-dropdown trigger="click" style="float:left;" @command="handleFrameCommand">
                <div class="choices_btn"><i class="el-icon-plus"></i></div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-bind:command="{'type':'frame','params':frame.idx}" v-for="frame in float_frames" :key="frame.idx"><div class="little_icon" :style="{backgroundImage:'url('+frame.icon+')'}"></div>{{frame.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        <div class="hidden_btn" v-on:click="frame_hidden=true;"><i class="el-icon-minus"></i></div>
        <!-- <div class="close_btn" v-on:click="frame_closed=true;"><i class="el-icon-close"></i></div> -->
      </div>
      <div class="main_board">
          <iframe :src="float_frames[frame_idx].link"></iframe>
      </div>
    </div>
  </el-container>
</template>

<script>
const $ = require("jquery");
const axios = require("axios");
const config = require("../utils/config");
const Loadding = require("../utils/loadding");
// const translate = requirezassets/translate")

import Vue from "vue";
import VueRouter from "vue-router";
import User from "./User";
import PaperManager from "./menus/PaperManager";
import PaperEditor from "./menus/PaperEditor";
import TagManager from "./menus/TagManager";
import MeetingManager from "./menus/MeetingManager";
import PlanManager from "./menus/PlanManager";
import PlanEditor from "./menus/PlanEditor";
import Analysis from "./menus/Analysis";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    
    {path: '/', redirect: '/papermanager/1'},
    { path: "/user", component: User },
    { path: "/papermanager/:pagenum", component: PaperManager, props: true },
    { path: "/papereditor/:id", component: PaperEditor, props: true },
    { path: "/tagmanager", component: TagManager },
    { path: "/meetingmanager", component: MeetingManager },
    { path: "/planmanager", component: PlanManager },
    { path: "/planeditor/:id", component: PlanEditor, props: true },
    { path: "/analysis", component: Analysis }
  ]
});

export default {
  router: router,
  name: "Main",
  props: {
    msg: String
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
        frame_idx:0,
        frame_hidden:true,
        // frame_closed:false,
        float_frames:[
            {
                idx:0,
                name:"tanslate",
                link:config.tool_translate,
                icon:"https://www.gstatic.cn/translate/ic_translate_googblue600_20dp.svg",
                height:"calc(20% - 20px)",
                minHeight:"150px",
                width:"40%",
                minWidth:"500px"
            },
            {
                idx:1,
                name:"MD5加密",
                link:config.tool_crypto,
                icon:"https://image.flaticon.com/icons/png/128/891/891403.png",
                height:"120px",
                minHeight:"100px",
                width:"40%",
                minWidth:"500px"
            }
        ],
      config: config,
      darkMode: false,
      show_aside: true,
      defaultPageIdx: 0,
      user_info: {},
      translate: {
        query: "",
        translation: {}
      },
      isRouterAlive: true,
      aside_left: 0,
      menu_indexOf: [
        "user",
        "papermanager",
        "tagmanager",
        "meetingmanager",
        "planmanager",
        "analysis"
      ],
      menu: [
        {
          idx: 0,
          title: "用户管理",
          icon: "el-icon-user",
          route: "/user"
        },
        {
          idx: 1,
          title: "Paper管理",
          icon: "el-icon-paperclip",
          route: "/papermanager/1"
        },
        {
          idx: 2,
          title: "标签管理",
          icon: "el-icon-price-tag",
          route: "/tagmanager"
        },
        {
          idx: 3,
          title: "会议管理",
          icon: "el-icon-receiving",
          route: "/meetingmanager"
        },
        {
          idx: 4,
          title: "计划管理",
          icon: "el-icon-s-order",
          route: "/planmanager"
        },
        {
          idx: 5,
          title: "统计分析",
          icon: "el-icon-data-analysis",
          route: "/analysis"
        }
      ]
    };
  },
  mounted: function() {
    var that = this;
    that.defaultPageIdx = that.menu_indexOf.indexOf(
      location.hash.substring(2).split("/")[0]
    );
    axios.interceptors.request.use(request => {
      const jwt_token = window.localStorage.getItem("jwt_token");
      var _darkMode = localStorage.getItem("RSB_darkMode");
      if (_darkMode) {
        this.darkMode = _darkMode == "false" ? false : true;
      } else {
        localStorage.setItem("RSB_darkMode", this.darkMode);
      }
      var _show_aside = localStorage.getItem("RSB_show_aside");
      if (_show_aside) {
        this.show_aside = _show_aside == "false" ? false : true;
      } else {
        localStorage.setItem("RSB_show_aside", this.show_aside);
      }
      if (jwt_token) {
        // 此处有坑，下方记录
        request.headers["Authorization"] = `${jwt_token}`;
      }
      return request;
    });

    // 拦截响应，遇到token不合法则报错
    axios.interceptors.response.use(
      response => {
        if (response.data.token) {
          console.log("jwt_token:", response.data.token);
          window.localStorage.setItem("jwt_token", response.data.token);
        }
        return response;
      },
      error => {
        const errRes = error.response;
        if (errRes.status === 401) {
          window.localStorage.removeItem("jwt_token");
          window.location.href = config.login_path;
        }
        return Promise.reject(error.message); // 返回接口返回的错误信息
      }
    );
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process("拉取数据", async function() {
      var returndata = await axios.get(config.server_host + "/api/user/info");
        console.log(returndata);
        that.user_info = returndata.data.data;
    });
    first_loadding.add_process("设定事件",async function() {
      await that.add_frame_drag_event();
    });
    first_loadding.start();
  },
  methods: {
    reload: function() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    change_mode: function() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("RSB_darkMode", this.darkMode);
    },
    change_show_aside: function() {
      this.show_aside = !this.show_aside;
      localStorage.setItem("RSB_show_aside", this.show_aside);
    },
    translate2cn: function() {
      var that = this;
      axios
        .post(config.server_host + "/api/tool/translate_cn", {
          query: that.translate.query
        })
        .then(returndata => {
          that.translate.translation = returndata.data;
        });
    },
    add_frame_drag_event:function(){
        $("#float_board").find(".dragger_haddle").on("mousedown",function(ev){
            console.log("mousedown")
            var startX = ev.pageX,startY = ev.pageY;
            var dom = this.parentElement.parentElement;
            var topline = this.parentElement;
            var dom_x = dom.offsetLeft, dom_y = dom.offsetTop;
            var frame_board_move_flag = true;
            dom.style.transform = "scale(.8) translate(0px,calc(-10%))";
            dom.style.marginTop = "-15px";
            topline.style.height = "100%"
            $(document).on("mousemove",function(d_ev){
                if(!frame_board_move_flag){
                    return;
                }
                dom.style.transition = "none";
                dom.style.left = (d_ev.pageX - startX + dom_x) + 'px';
                dom.style.top = (d_ev.pageY - startY + dom_y) + 'px';
            })
            $(document).on("mouseup",function(d_ev2){
                    if(!frame_board_move_flag){
                        return;
                    }
                    frame_board_move_flag = false;
                    dom.style.transition = "ease .3s";
                    dom.style.transform = "scale(1)";
                    dom.style.marginTop = "0";
                    topline.style.height = "30px"
                    if(d_ev2.pageX > window.innerWidth/2){
                        dom.style.left = 'auto';
                        dom.style.right = '10px';
                    }else{
                        dom.style.left = '10px';
                        dom.style.right = 'auto';
                    }
                    if(d_ev2.pageY > window.innerHeight/2){
                        dom.style.top = 'auto';
                        dom.style.bottom = '10px';
                    }else{
                        dom.style.top = '10px';
                        dom.style.bottom = 'auto';
                    }
                }
                )
        })
    },
    handleFrameCommand:function(command){
          if(command.type=="frame"){
            console.log(command)
              this.frame_idx = parseInt(command.params)
              return;
          }
      },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../assets/theme";
$head_height: 30px;
#aside_bar .el-row {
  margin: 0px;
}
body {
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
#main {
  background: white;
  position: relative;
  transition: ease 0.5s;
}
#menu-btn {
  background: teal !important;
  padding: 10px;
  font-size: 10px;
  color: white;
  border: 0px !important;
  box-shadow: black 0px 0px 10px -2px;
  transition: ease 0.5s;
  margin: 10px;
  position: fixed;
  z-index: 1001;
}
.top_bar {
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
.title_bar {
  line-height: 30px;
  font-size: 1.5em;
  color: black;
  font-weight: bold;
  margin: 10px;
}
#aside_bar {
  width: 200px;
  background: white;
  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 100;
  transition: ease 0.5s;
}

.image {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
}
.menu_top {
  height: auto;
  overflow: hidden;
}
.menu_top .el-card {
  margin: 0px;
  margin-bottom: 10px;
  border: 0px !important;
  border-radius: 0px;
}
.menu_top .el-card__body {
  text-align: center;
  height: 150px;
  padding: 0px;
}
.menu_top i {
  float: left;
  font-size: 1.3em;
  font-weight: bold;
}

$menu_item_h: 20px;
.menu_item .el-button {
  margin: 2px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  overflow: hidden;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  width: calc(100% - 20px);
  line-height: 20px;
}

.menu_item i {
  float: left;
  line-height: $menu_item_h;
  font-size: 1.3em;
  font-weight: bold;
}
.Loadding_cover {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100000;
  transition: ease 0.5s;
}
.Loadding_board {
  position: fixed;
  top: 40%;
  left: 50%;
  height: auto;
  width: 40%;
  margin-left: -20%;
  background: rgb(255, 255, 255);
  z-index: 100001;
  border-radius: 1em;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
.Loadding_title {
  height: 1.5em;
  color: black;
  font-size: 1em;
  line-height: 1.5em;
  text-align: center;
  font-weight: bold;
}
.Loadding_bar {
  height: 5px;
  width: calc(10% - 20px);
  margin-left: 10px;
  background: #81c784;
  border-radius: 10px;
  margin: 10px;
}
.Loadding_bar::before {
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
.Loadding_info {
  height: 1.5em;
  color: #999999;
  font-size: 0.8em;
  line-height: 1.5em;
  margin: 5px;
  text-align: left;
  text-indent: 10px;
}
#dark-mode-control {
      position: fixed;
    z-index: 2001;
    right: 20px;
    text-align: center;
    color: black;
    bottom: 0px;
    margin-bottom: 10px;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
  .el-button {
    background: #f9a825;
    border: 0px;
    transition: ease 0.5s;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    i {
      font-size: 20px;
      color: white;
      font-weight: bold;
    }
  }
  .dark-mode-status {
    font-size: 12px;
    color: black;
  }
}

#float_board {
  bottom: 10px;
  position: fixed;
  height: calc(50% - 20px);
  width: 40%;
  background: white;
  z-index: 2000;
  left: 10px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition:ease .2s;
  .hidden_circle{
        height: 100%;
    width: 100%;
        background-size: 50%;
        border-radius: 40px;
        background-repeat: no-repeat;
        background-position: center;
        display: none;
  }
  .top_line {
    position: absolute;
    background: #eee;
    height: 30px;
    width: 100%;
    z-index: 1;
    opacity: 0;
    transition: ease .2s;
  }
  .top_line:hover{
    opacity: 1;
  }
  .dragger_haddle{
          height: 30px;
    width: calc(100% - 120px);
    position:relative;
    float: left;
        cursor: move;
  }
  .dragger_haddle:before{
          content: "";
    background: rgba(0,0,0,.2);
    height: 6px;
    width: 20%;
    position: absolute;
    left: 40%;
    border-radius: 10px;
    top: 50%;
    margin-top: -3px;
  }
  .hidden_btn{
    height: 14px;
    width: 14px;
    float: left;
    background: #80CBC4;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .hidden_btn:hover{
      background: #009688;
      color: black;
  }
  .close_btn{
          height: 14px;
    width: 14px;
    float: left;
    background: #E57373;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .close_btn:hover{
      background: #D32F2F;
      color: black;
  }
  .choices_btn{
          height: 14px;
    width: 14px;
    float: left;
    background: #FFE082;
    margin: 7px;
    border-radius: 10px;
    font-size: 5px;
    color: transparent;
    line-height: 14px;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .choices_btn:hover{
      background: #FFC107;
      color: black;
  }
  .main_board{
    height: 100%;
    width: 100%;
    // margin-top:30px;
    iframe{
        border: 0px;
    height: 100%;
    width: 100%;
    }
  }
}
#float_board.hidden {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    border-radius: 100px;
    .hidden_circle{display: block;}
    .top_line {display: none;}
    .main_board {display: none;}
}

.el-dropdown-menu__item .little_icon{
    height: 20px;
    width: 20px;
    float: left;
    background-position: center;
    background-size: cover;
    border-radius: 20px;
        margin: 8px 0px;
    margin-right: 10px;
  }
.aside_active {
  width: 50px !important;
  .menu_top {
    height: 0px;
    margin-bottom: 160px !important;
  }
  .menu_item .el-button {
    margin: 2px 2px;
    width: 45px;
    span i {
      float: none;
    }
    span span {
      display: none;
    }
  }
  #dark-mode-control {
    padding: 0px;
    button {
      width: 50px;
      border-radius: 0px;
      margin-left: 0px;
    }
    div {
      display: none;
    }
  }
  #menu-btn {
    margin: 0;
    border-radius: 0px;
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
}
// dark-mode
$dark-mode-bg: #222;
$dark-mode-font-color: #eee;
#main-app.dark-mode {
  #main {
    background: $dark-mode-bg;
  }
  #dark-mode-control {
    color: #eee;
    .el-button {
      background: #333;
    }
    .dark-mode-status {
      color: #eee;
    }
  }
  .top_bar {
    color: $dark-mode-font-color;
  }
  .title_bar {
    color: $dark-mode-font-color;
  }
  #aside_bar {
    background: $dark-mode-bg;
    box-shadow: 2px 0px 0px #343434;
  }

  .menu_item .el-button {
    border: 1px solid #343434;

    background: rgba(255, 255, 255, 0.2);
    color: $dark-mode-font-color;
  }

  .Loadding_board {
    background: $dark-mode-bg;
  }
  .Loadding_title {
    color: $dark-mode-font-color;
  }
}

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
  .meeting_list .el-tag{
    cursor: pointer;
    margin: 2px 5px;
    border-radius: 10px;
    padding: 0px 20px;
}
.meeting_search{
    box-shadow: 0px 0px 0 0 black !important;
    background: transparent !important;
    border: 0px !important;
}
.meeting_list .nums .el-badge__content{
    margin:5px;
}

.full-screen{
    margin-top: 0px !important;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 2000;
    margin: 0px;
    height: 100%;
    width: 100%;
    overflow: auto !important;
    .editor_header{
        position: fixed;
    z-index: 2000;
    background: white;
    width: 100%;
    top: 0px;
    left: 0px;
    padding:10px 20px;
    box-shadow: 0px 3px 10px rgba(0,0,0,.1);
    }
    .under-editor-header{
        margin-top:50px;
    }

}
.paper_info{
    position: relative;
    transition: ease .5s;
}
.ops{
        margin: 0px;
    padding: 10px;
    margin-bottom: 10px;
}
.ops .el-button i{
    font-weight: bold;
}
.paper_title{
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
    text-shadow: 2px 2px 6px #ddd;
}
.paper_author{
    margin-top: 10px;
    text-align: center;
}
.paper_meeting{
    text-align: center;
    margin-top: 10px;
}
.paper_cite{
    text-align: right;
    font-size: 12px;
    margin: 10px 0px;
}
.paper_cite span{
    color:#999;
}

.paper_edit{
    margin-top: 10px;
}
.paper_edit .el-form-item__label{
    line-height: 20px;
}
.status_bar{
        position: absolute;
    bottom: 0px;
    left: 0px;
    height: 5px;
    background: #009688;
    transition: ease .5s;
    border-radius: 10px;
}

.el-textarea__inner{
    background:#333 !important;
    color:white !important;
}
.el-tag + .el-tag {
margin-left: 10px;
}
.button-new-tag {
margin-left: 10px;
height: 32px;
line-height: 30px;
padding-top: 0;
padding-bottom: 0;
}
.input-new-tag {
width: 150px !important;
margin-left: 10px;
vertical-align: bottom;
}

#md_editor{
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px 10px;
    margin: 10px 0;
    font-size: .8em;
    box-sizing: border-box;
    box-shadow: 5px 5px 10px rgba(0,0,0,.1);
    transition: ease .5s;
}
#md_editor .katex .katex-html {
    display: inline-block;
    white-space: break-spaces;
    line-height: 2;
}
#md_editor .katex .fontsize-ensurer.reset-size3.size1,#md_editor  .katex .sizing.reset-size3.size1 {
    font-size: 1em;
    transform: scale(.7);
}
#md_editor blockquote {
    margin: 2px;
    background: rgba(0,0,0,.02);
    padding: 1em;
    border-radius: 0px;
}
#md_editor a img{
    height: 1.5em;
    transform: translate(0px, .3em);
    background:transparent;
}
#md_editor img{
    max-height: 400px;
    border-radius: 10px;
}
.el-slider__runway,.el-slider__stop{
background: rgba(255,255,255,.5);
}

#push-pic-board{
    position: absolute;
    top:calc(100% + 10px);
    width:calc(100% - 20px);
    z-index: 100;
}
#push-pic-board .el-card__body{
    padding:0px;
}

thead tr th,.el-table tr ,.el-table,thead, thead tr{
    background:transparent !important;
}
.el-divider__text{
        transition: ease .5s;
    }
#main-app.dark-mode{
    .paper_info{
        background: #333;
    }
    .paper_title{
        text-shadow: 0px 0px 0px;
    }
    .el-textarea__inner{
        border:1px solid #555;
    }
    .full-screen .editor_header{
        background:#444;
    }
    #md_editor{
        background: #444;
        color: #eee;
        border: 1px solid #555;
    }
    #md_editor .katex .katex-html {
        display: inline-block;
        white-space: break-spaces;
        line-height: 2;
    }
    #md_editor .katex .fontsize-ensurer.reset-size3.size1,#md_editor  .katex .sizing.reset-size3.size1 {
        font-size: 1em;
        transform: scale(.7);
    }
    #md_editor blockquote {
        margin: 2px;
        background: rgba(255,255,255,.1);
        border-radius: 0px;
        border-color: #333;
        color: #aaa;
    }
    #md_editor a{
        color:#64B5F6;
    }
    #md_editor thead tr th{
        background: #333 !important;
    color: white;
    }
    #md_editor table th{
        border: 1px solid #333;
    }
    .el-tag{
        background: rgba(255,255,255,.2);
        color: #eee;
    }
    .el-tag__close{
        color: #eee;
    }
    .left_table .el-tag__close{
        background: rgba(255,255,255,.1);
    }
    .el-table th{
        //background: #333 !important;
        color:#eee;
        border-bottom: 1px solid #444 !important;
    }
    .el-table td{
        //background: #333 !important;
        border-bottom: 1px solid #444 !important;
    }
    .el-table tr{
        //background: #333 !important;
        color:#eee;
    }
    .el-table tr:hover{
        color:#555;
        border-radius: 10px;
    }
    .el-divider__text{
        background: #222;
        color:#eee;
    }
    .el-input-number__increase{
        background: #333;
    color: #eee;
    border-left: 1px solid #555;
    }
    .el-input-number__decrease{
            background: #333;
    color: #eee;
    border-right: 1px solid #555;
    }
    // .th{
    //     background: #333;
    //     color:#eee;
    // }
}
.add_board{
        position: fixed;
    width: 40%;
    margin-top: 50px;
    z-index: 100;
    transition: ease .5s;
}
.add_to_table{
        position: absolute;
    z-index: 11;
    width: 50%;
    margin-left: 25%;
    transition: ease .5s;
}
.add_board .el-form-item__label{
    line-height: 20px;
}
.paper{
    width: calc(50% - 12px);
    margin: 5px;
    float: left;
    position: relative;
    // min-width: 150px;
    transition:ease .5s;
}
.paper .el-card__body{
    position: unset !important;
}
@media only screen and (max-width: 767px){
    .paper{
        width: calc(100% - 12px);
    }
    #aside_bar{
        position: absolute !important;
        z-index:2000 !important;
    }
    #main{
        margin-left:40px;
    }
    .paper_tags .el-tag{
        margin: 2px;
        margin-left: 10px;
    }
    #float_board{display: none;}
}

@media only screen and  (min-width: 767px) and (max-width: 1024px)
{
    .paper{
        width: calc(50% - 12px);
    }
    #aside_bar{
        position: absolute !important;
        z-index: 2000 !important;
    }
    #main{
        margin-left:40px;
    }
    .paper_tags .el-tag{
        margin: 2px;
        margin-left: 10px;
    }
    #float_board{display: none;}
}
.paper .el-card__header{
    font-weight: bold;
    font-size: 1em;
        position: relative;
    z-index: 10;
    padding-top: 1.5em;
}
.paper .ptime{
    font-size:12px;
}
.paper .meeting{
        position: absolute;
    z-index: 0;
    color: #ddd;
    top: 0px;
    left: 20px;
    font-size: 1em;
    line-height: 1.6em;
    font-weight: bold;
}
.paper_query_item{
    background-color:rgba(0,128,128,.1);
    border-radius: 10px;
    text-indent: 10px;
}
.pagination_board{
text-align: center;
    background: white;
    border-radius: 10px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(0,0,0,.1);
}
.micro_tag{

    font-size: 8px !important;
    border-radius: 10px !important;
    padding: 0px 10px !important;
    height: 20px !important;
    line-height: 20px !important;
    background:$--color-primary !important;
    color:white !important;
    border:0px !important;
}
.finished{
    box-shadow: 0 2px 8px -1px rgba(0, 0, 0, 0.1) inset !important;
    background: white  !important;
    border: 2px dashed teal  !important;
    border-bottom: 0px  !important;
    box-sizing: border-box  !important;
}
.finished::before{
    content: "\e6da";
    font-family: 'element-icons' !important;
    position: absolute;
    background: #43A047;
    border-radius: 15px;
    padding: 6px;
    color: white;
    height: 15px;
    font-weight: bold;
    box-shadow: 0px 2px 12px 0 rgba(0, 0, 0, 0.1);
    top: 5px;
    right: 5px;
    width: 15px;
    line-height: 15px;
    text-align: center;
}
.el-collapse-item__content{padding: 10px !important;}
.el-collapse-item__header,.el-collapse-item__content{
    transition: ease .5s;
}
.el-card{
    transition: ease .5s;
}
#main-app.dark-mode{
    .el-card{
        background: #333;
        border: 1px solid #444;
        color: #eee;
    }
    .add_board{
        background: #333;
        border: 1px solid #444;
        color: #eee;
    }
    .add_to_table{
        background: #333;
        border: 1px solid #444;
        color: #eee;
    }
    .pagination_board{
        background:#444;
    }
    .el-collapse-item__header{
        background: transparent;
        border-bottom: 1px solid #444;
        color: #eee;
    }
    .el-collapse-item__content{
        background: #333;
        color: #eee;
        border-bottom: 1px solid #444;
    }
    .el-collapse-item__wrap{
        border-bottom: 1px solid #444;
    }
    .el-collapse{
        border-top: 1px solid #444;
    }
    .el-form-item{
        .el-form-item__label{
            color: #eee;
        }
    }
    
    .el-input__inner{
        color: #eee;
        background: #444;
        border: 1px solid #666;
    }
    .el-card__header{
        border-bottom: 1px solid #444;
    }
    .el-button--default{
        color: #eee;
        background: #444;
        border: 1px solid #666;
    }
    .paper .meeting{
        color: #eee;
    }
    .micro_tag{
        color:#eee !important;
    }
    .finished{
            background: #333 !important;
            color: white !important;
    }
    .paper{
        background: #333 !important;
        color: white !important;
    }
}
.el-card .el-card__body{
    position: relative;
}
.plan_process{
    width: 80%;
    position: absolute;
    top: 0px;
    left:0px;
    height: 5px;
    background: $--color-primary;
    border-radius: 10px;
}
.left_table{
    min-width: 150px;
    text-align: center;
    margin: 10px;
    cursor: pointer;
    font-size: 16px !important;
    float: left;
    position: relative;
    // max-width: 50%;
    padding-right:40px !important;
}
.left_table .el-tag__close.el-icon-close{
        position: absolute;
    top: 5px;
    right: 5px;
    background: white;
    font-size: 15px;
    padding: 2px;
    height: 16px;
    box-shadow: -2px 1px 6px rgba(0,0,0,.1);
    width: 16px;
}
.left_table .el-tag__close.el-icon-close:hover{
    background: $--color-primary;
    color:white;
}
.nums .el-badge__content{
    margin:10px;
}
.tag_list .el-tag{
        cursor: pointer;
    margin: 2px 5px;
    border-radius: 10px;
    padding: 0px 20px;
}
.tag_search{
    box-shadow: 0px 0px 0 0 black !important;
    background: transparent !important;
    border: 0px !important;
}
.tag_list .nums .el-badge__content{
    margin:5px;
}
</style>
