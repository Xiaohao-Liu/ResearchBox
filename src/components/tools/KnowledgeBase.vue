<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;padding-top:30px;"  v-loading="loading">
      <el-row :gutter="10">
          <el-input placeholder="请输入内容" v-model="querykey" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
        </el-input>
      </el-row>
      <el-row :gutter="10">
            <el-button type="primary" icon="el-icon-document-add" style="margin-top:10px;" @click="show_add_knowledge=!show_add_knowledge">添加</el-button>
            <el-card class="add_board" v-show="show_add_knowledge">
                <el-form label-position="top" label-width="80px" :model="add_form">
                    <el-form-item label="标题" prop="add_title">
                        <el-input v-model="add_form.key"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="add_knowledge">立即添加</el-button>
                        <el-button v-on:click="show_add_knowledge=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
      </el-row>
      <div :class="'k_item_board' + (k.expanded?' expand':'')  + (k.edit?' edit':'')" v-for="k in reslist" :key="k.id">
          <div class="k_item_key" @click="k.expanded = !k.expanded">{{k.key}}</div>

          <!-- <el-button type="danger" icon="el-icon-close" v-show="k.expanded == true" circle style="margin-left:10px;float:right;"  @click="k.expanded = false"></el-button> -->
        <el-button type="danger" icon="el-icon-delete"  circle style="float:right;padding:6px;"  @click="del(k.id)"></el-button>
        <el-button type="primary" :icon="(!k.edit?'el-icon-edit':'el-icon-check')"  circle style="float:right;padding:6px;margin-right:10px;"  @click="k.edit=!k.edit"></el-button>
        <el-row>    
            <el-col :span="24" class="paper_tags">
                <el-tag
                    :key="paper.id"
                    v-for="paper in k.papers"
                    :closable="k.edit"
                    :disable-transitions="false"
                    @close="handleClose(k,paper.id)">
                    {{(paper.title.substring(0,25) + (paper.title.length >25?'...':''))}}
                    </el-tag>
                    <!-- <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(k,paper.id)"
                        @blur="handleInputConfirm(k,paper.id)"
                    > -->
                    <el-select v-show="k.edit" style="width:200px;margin:5px 0px;" v-model="k.select_paper_lite" @change="handlePush(k)" clearable autocomplete default-first-option filterable placeholder="请搜索">
                      <el-option 
                      style="margin:5px"
                      v-for="item in paper_lite_list"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                        <div class="paper_query_item" :style="{width:item.process + '%'}">
                            {{item.title}}
                        </div>
                        </el-option>
                    </el-select>
                    <!-- <el-button v-show="!k.inputVisible" class="button-new-tag" size="small" style="margin-left: 20px;" @click="k.inputVisible=true">+ New Tag</el-button> -->
            </el-col>
        </el-row>
        <div v-show="k.expanded || k.edit">
            <el-divider></el-divider>
            
            <div id="md_editor" class="markdown-body" :style="{fontSize:'.8em'}" v-html="markdown.render(k.md)"></div>    
            <el-input v-show="k.edit"
              style="box-shadow: 5px 5px 10px rgba(0,0,0,.1);margin:10px 0px;"
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="k.md">
          </el-input>
          <el-button v-show="k.edit" type="primary" icon="el-icon-upload"  circle style="position: absolute;right: 10px;bottom: 10px;"  @click="upload(k)"></el-button>
        </div>
      </div>
  </el-main>
</template>

<script>
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
import markdownIt from 'markdown-it'
import markdownItLatex from 'markdown-it-latex'
import 'markdown-it-latex/dist/index.css';
import '../../assets/github-markdown.min.css';
const axios = require('axios');

const md = markdownIt()
md.use(require('markdown-it-highlightjs'),{ inline: true })
md.use(markdownItLatex)

export default {
  name: 'PicLinks',

  data(){
    return {
        markdown:md,
        loading:false,
        querykey:"",
        show_add_knowledge:false,
        add_form:{
            key:""
        },
        value:false,
        reslist:[]
    }
  },
  mounted:function(){
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
    var that = this;
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取paper数据",
        async function(){
            var returndata = await axios.get(
                config.server_host + "/api/paper/by_ntime_query"
            );
                    console.log(returndata)
                    that.paper_lite_list=returndata.data.data;

        }
    );
    first_loadding.start();
  },
  methods:{
      add_knowledge:function(){
          var that = this;
          var loadding = new Loadding();
            loadding.add_title("添加");
            loadding.__init__();
            loadding.add_process(
                "添加Knowledge",
                async function(){
                await axios.post(
                    config.server_host + "/api/knowledge/add",
                    {"key":that.add_form.key}
                );
                        that.show_add_knowledge=false;
                        // window.location.reload();
            })
        loadding.start();
      },
      del:function(id){
        var that = this;
          var loadding = new Loadding();
            loadding.add_title("删除");
            loadding.__init__();
            loadding.add_process(
                "删除Knowledge",
                async function(){
                await axios.post(
                    config.server_host + "/api/knowledge/del",
                    {"id":id}
                );
                that.query();
            })
        loadding.start();
      },
      query:function(){
          var that = this;
          var loadding = new Loadding();
            loadding.add_title("初始化");
            loadding.__init__();
            loadding.add_process(
                "添加table",
                async function(){
                var returndata = await axios.post(
                    config.server_host + "/api/knowledge/query",
                    {"key":that.querykey}
                );
                that.reslist.splice(0,that.reslist.length);
                for(let i = 0;i < returndata.data.data.length;i++){
                    returndata.data.data[i].expanded =false;
                    returndata.data.data[i].inputVisible =false;
                    returndata.data.data[i].select_paper_lite = '';
                    returndata.data.data[i].edit =false;
                    returndata.data.data[i].papers =returndata.data.data[i].papers==null?[]:JSON.parse(returndata.data.data[i].papers);
                    returndata.data.data[i].md =returndata.data.data[i].md==null?"":returndata.data.data[i].md;
                    that.reslist.push(returndata.data.data[i]);
                }
                console.log(that.reslist);
            })
        loadding.start();
      },
      upload:function(k){
        // var that =this;
        const l = ["id","key","papers","md"]
        var loadding = new Loadding();
        loadding.add_title("初始化");
        loadding.__init__();
        loadding.add_process(
            "更新数据",
            async function(){
            var form = {}
            for(var i in l)form[l[i]] = k[l[i]];
            form['papers'] = JSON.stringify(form['papers']);
            await axios.post(
                config.server_host + "/api/knowledge/uploadone",
                {"id":k.id,"new_knowledge":form}
            );
            })
            loadding.start();
      },
      handleClose:function(k,paperid) {
        for(let i = 0;i < k.papers.length;i++){
          if(k.papers[i].id == paperid){
            k.papers.splice(i, 1);
            break;
          }
        }        
        
      },
      handlePush:function(k) {
        for(let i = 0;i < k.papers.length;i++){
          if(k.papers[i].id == k.select_paper_lite){
            return;
          }
        }    

        for(let i = 0;i < this.paper_lite_list.length;i++){
          if(k.select_paper_lite == this.paper_lite_list[i].id){
            k.papers.push({
              id:this.paper_lite_list[i].id,
              title:this.paper_lite_list[i].title,
            })
            k.inputVisible = false;
            break;
          }
        }
        
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
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
.k_item_board{
        background: white;
    box-shadow: 0px 7px 40px rgba(0,0,0,.1);
    border-radius: 10px;
    margin: 10px 0px;
    padding: 10px;
    border: 1px solid #eee;
        box-sizing: border-box;
    transition: ease .5s;
    .k_item_key{
        font-weight: bold;
            line-height: 30px;
            display: inline-block;
    }
}
.k_item_board.edit{
    position: absolute;
    top:0px;
    left:0px;
    min-height: 100%;
    width: 100%;
    padding-top: 30px;
    margin:0px;
    z-index: 2;
    padding-bottom:50px;
}
.el-tag{
      padding: 2px 5px;
    line-height: 14px;
    height: auto;
    margin-right: 5px;
}


#md_editor{
    width: 100%;
    // border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px 10px;
    // margin: 10px 0;
    font-size: .8em;
    box-sizing: border-box;
    // box-shadow: 5px 5px 10px rgba(0,0,0,.1);
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
#md_editor p{
      margin-bottom: 0px;
}
.el-divider--horizontal{
  margin:10px 0px;
}
</style>
