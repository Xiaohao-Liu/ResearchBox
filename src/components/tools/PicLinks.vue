<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;padding-top:30px;"  v-loading="loading">
      <div :class="'top_tip'+ (msg_hidden?' hidden':'')">
            <el-button icon="el-icon-circle-check" circle style="background: transparent;
    color: green;
    font-size: 1em;
    border: 0px;
    padding: 0px;"></el-button><div style="color:#333;font-size:10px;">{{msg}}</div>
      </div>
    <el-row v-for="img in imgs" :key="img.idx" class="piclink_link">
        <el-col :span="12"><div class="line_img" :style="{backgroundImage:'url('+img.piclink+')'}"></div></el-col>
        <el-col :span="12"> <el-button  :pid="img.idx" class="line_button" :data-clipboard-target="'#img_link_'+img.idx">Copy</el-button><span style="    width: 2px;
    overflow: hidden;height:2px;
    display: block;
    float: right;
    text-indent: 20px;font-size:1px;position:absolute;" :id="'img_link_'+img.idx">{{img.piclink}}</span></el-col>
    </el-row>
  </el-main>
</template>

<script>
const config = require("../../utils/config");
const axios = require("axios");
import Clipboard from 'clipboard';
const md5 = require("../../utils/md5")
export default {
  name: 'PicLinks',

  data(){
    return {
        loading:true,
        msg:"",
        msg_hidden:true,
        imgs:[
            // {
            //     idx:0,
            //     name:"github",
            //     piclink:"https://github.githubassets.com/favicons/favicon.svg"
            // },
            // {
            //     idx:1,
            //     name:"colab",
            //     piclink:"https://colab.research.google.com/img/favicon.ico"
            // },
            // {
            //     idx:2,
            //     name:"google dirver",
            //     piclink:"https://static.easyicon.net/preview/122/1224623.gif"
            // },
            // {
            //     idx:3,
            //     name:"MM'20",
            //     piclink:"https://2020.acmmm.org/asset/images/icon.png"
            // },
            // {
            //     idx:4,
            //     name:"WWW'20",
            //     piclink:"https://www2020.thewebconf.org/public/resources/images/favicon.png"
            // },
            // {
            //     idx:5,
            //     name:"Microsoft",
            //     piclink:"https://c.s-microsoft.com/favicon.ico?v2"
            // }
        ]
    }
  },
  mounted:function(){
      var that = this;
      axios.get(config.server_host + config.piclinks).then(res=>{
          let data = JSON.parse(res.data.data)
          for(var i =0;i< data.length;i++){ 
              this.imgs.push(data[i]);
          }
          this.loading=false;
      })
        var clipboard = new Clipboard('.line_button');

        clipboard.on('success', function(e) {
            var pid = e.trigger.getAttribute('pid');
            that.msg = that.imgs[pid].name + " Copied!";
            that.msg_hidden = false;
            setTimeout(()=>{
                that.msg_hidden = true;
            },3000);
            e.clearSelection();
        });

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
html{
  overflow-x:auto;
  overflow-y: auto !important;
}
*{
  box-sizing: content-box;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
width:5px;
height:5px;
background-color: #eee;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
border-radius:5px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
border-radius:5px;
background:#aaa;
}
.el_message{
    width: auto;
}
.piclink_link{
    background: rgba(0,0,0,.02);padding: 5px;border-radius: 10px;text-align: center;
    transition: ease .5s;
    margin:5px 0px;
}
.piclink_link:hover{
    background:$--color-primary-50;
}
.line_img{
        display: inline-block;
    border-radius: 100%;
    background-position: center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    margin: auto;
    height: 1em;
        padding: 5px 12px;
}
.line_button{
    padding:5px 12px;
        line-height: 1em;
    font-size: 1em;
    background:$--color-primary;
    color:white;
    font-weight: bold;
        box-shadow: 0px 5px 22px -6px $--color-primary;
    border: 0px;
}
.top_tip{
    transition: ease .5s;
        padding: 5px;
    width: calc(100% - 20px);
    background: rgba(255,255,255,.9);
    position: fixed;
    border: 1px solid #eee;
    z-index: 10001;
    backdrop-filter: blur(4px);
    box-sizing: border-box;
    top: 10px;
    left: 10px;
    border-radius: 10px;
    box-shadow: 0px 2px 20px -15px black;
}
.top_tip.hidden{
    top:-100px;
}
</style>
