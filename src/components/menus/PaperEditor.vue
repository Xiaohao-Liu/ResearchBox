<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-paperclip"></i>Paper管理 </el-col>
        </el-row>
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-back" v-on:click="$router.push('/papermanager')" circle></el-button>
        <el-button type="primary" icon="el-icon-finished" v-on:click="upload_all()" circle></el-button>
    </el-row>
    <el-card  class="paper_info">
        <el-row>
            <el-col :span="12" class="paper_link" > <el-link v-bind:href="edit_form.link" target="_blank">{{edit_form.link}}</el-link> </el-col>
            <el-col :span="12" style="text-align:right;" > {{new Date(parseInt(edit_form.Ntime)).getFullYear()}} - {{new Date(parseInt(edit_form.Ntime)).getMonth() + 1}} </el-col>

        </el-row>
        <div class="status_bar" v-bind:style="{width:edit_form.process + '%'}"></div>
        <el-row>
            <el-col :span="24" class="paper_title"> {{edit_form.title}} </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="paper_meeting" > {{edit_form.meeting!=''?edit_form.meeting:''}} {{new Date(parseInt(edit_form.Ptime)).getMonth() + 1}},{{new Date(parseInt(edit_form.Ptime)).getFullYear()}} </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="paper_author"> {{edit_form.author1}} {{edit_form.author2==""?'':','}} {{edit_form.author2}} </el-col>
        </el-row>
        <el-row>    
            <el-col :span="24" class="paper_cite"><span>cited:</span>{{edit_form.cite}}</el-col>
        </el-row>
        <el-row>    
            <el-col :span="24" class="paper_tags">
                <el-tag
                    :key="tag"
                    v-for="tag in edit_form.tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" style="margin-left: 20px;" @click="showInput">+ New Tag</el-button>
            </el-col>
        </el-row>
    </el-card>
    <el-row :gutter="10">
        <el-col :span="8">
            <el-card  class="paper_edit">
        <el-form ref="form" :model="edit_form" label-position="top" label-width="80px">
            <el-form-item label="阅读进度">
                <el-slider v-model="edit_form.process" :step="20" show-stops></el-slider>
            </el-form-item>
            <el-form-item label="标题">
                <el-input placeholder="请输入内容" v-model="edit_form.title" clearable class="paper_edit_title"> </el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-row :gutter="20">
                    <el-col :span="12" > <el-input placeholder="请输入内容" v-model="edit_form.author1" clearable class="paper_edit_author"> </el-input> </el-col>
                    <el-col :span="12" > <el-input placeholder="请输入内容" v-model="edit_form.author2" clearable class="paper_edit_author"> </el-input> </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发表会议/期刊">
                <el-input placeholder="请输入内容" v-model="edit_form.meeting" clearable class="paper_edit_meeting"> </el-input>
            </el-form-item>
            <el-form-item label="发表时间">
                <el-row>
                    <el-col :span="12" class="block">
                        <el-date-picker style="width: calc(100% - 10px);" v-model="edit_form.Ptime" type="year" value-format="timestamp" placeholder="选择年">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="12" class="block">
                        <el-date-picker style="width: calc(100% - 10px);" v-model="edit_form.Ptime" type="month" value-format="timestamp" placeholder="选择月">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="引用量">
                <el-input placeholder="请输入内容" v-model="edit_form.cite" clearable class="paper_edit_cite"> </el-input>
            </el-form-item><el-form-item label="链接">
                <el-input placeholder="请输入内容" v-model="edit_form.link" clearable class="paper_edit_link"> </el-input>
            </el-form-item>
        </el-form>

    </el-card>
        </el-col>
        <el-col :span="16">
<el-card style="margin-top:10px;">
    <el-row>
        <el-col :span="16">
            <span style="
                line-height: 30px;
                font-weight: bold;
                font-size: 18px;
            ">内容编辑</span>
        </el-col>
        <el-col :span="8">
            <el-button style="    float: right;
    padding: 10px;
    margin-right: 10px;
    " type="primary" :icon="'el-icon-'+(show_md_editor?'check':'edit')" circle @click="show_md_editor=!show_md_editor;"></el-button>    
        </el-col>
    </el-row>
    <el-row :gutter="10">
        <el-col :span="show_md_editor?12:24">
            <div id="md_editor" v-html="markdown.render(edit_form.md)"></div>
        </el-col>
    <el-col :span="show_md_editor?12:0">
<el-input
style="box-shadow: 5px 5px 10px rgba(0,0,0,.1);margin:10px 0px;"
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="edit_form.md">
        </el-input>
    </el-col>

        </el-row>
        <el-row>
            <el-col>
                <!-- <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入内容"
                    v-model="edit_form.md">
                    </el-input> -->
            </el-col>
        </el-row>
    </el-card>
        </el-col>
    </el-row>
    
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
import markdownIt from 'markdown-it'
import markdownItLatex from 'markdown-it-latex'
import 'markdown-it-latex/dist/index.css'
const axios = require('axios');

const md = markdownIt()
md.use(markdownItLatex)


export default {
  name: 'login',
  props: 
    ['id'],
  data(){
    var checkNull = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('该项不能为空'));
        }else{
            callback();
        }
    }
    return {
        markdown:md,
        show_md_editor:true,
        show_add_paper:false,
        edit_form:{
            title:"",
            author1:"",
            author2:"",
            cite:"",
            meeting:"",
            tags:[],
            process:"",
            link:"",
            Ptime:"",
            Ntime:"",
            md:""
        },
        inputVisible:false,
        inputValue:"",
        paper_list:[],
        rules: {
          add_title: [
            { validator: checkNull, trigger: 'blur' }
          ],
          add_author: [
            { validator: checkNull, trigger: 'blur' }
          ],

        }
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
    //   $.ajax({
    //         type:"GET",
    //         url: config.server_host + "/api/paper/fetchone/"+that.id,
    //         async:false,
    //         dataType:"json",
    //         success:function(returndata){
    //             var data = returndata.data.data[0];
    //             var s = ['title','author1','author2','cite','Ptime','Ntime','meeting','link']
    //             that.source_title = data["title"]
    //             for(var i =0;i<s.length;i++)that.edit_form[s[i]] = data[s[i]];
    //             if(data['tags'] != null){
    //                 that.edit_form['tags'] =data['tags']==''?[]:data['tags'].split(';');
    //                 console.log(data['tags'])
    //             }else that.edit_form['tags']=[]
    //             that.edit_form['process'] = parseInt(data['process']);
    //             that.edit_form['md'] = data['md'] == null?'':data['md']
    //             that.edit_form['Ptime'] = new Date(data['Ptime']).getTime();
    //             that.edit_form['Ntime'] = new Date(data['Ntime']).getTime();
    //             console.log(that.edit_form)
    //         }
    //     });
        axios.get(
            config.server_host + "/api/paper/fetchone/"+that.id
        ).then(
            returndata=>{
                var data = returndata.data.data[0];
                var s = ['title','author1','author2','cite','Ptime','Ntime','meeting','link']
                that.source_title = data["title"]
                for(var i =0;i<s.length;i++)that.edit_form[s[i]] = data[s[i]];
                if(data['tags'] != null){
                    that.edit_form['tags'] =data['tags']==''?[]:data['tags'].split(';');
                    console.log(data['tags'])
                }else that.edit_form['tags']=[]
                that.edit_form['process'] = parseInt(data['process']);
                that.edit_form['md'] = data['md'] == null?'':data['md']
                that.edit_form['Ptime'] = new Date(data['Ptime']).getTime();
                that.edit_form['Ntime'] = new Date(data['Ntime']).getTime();
                console.log(that.edit_form)
            }
        )
        })
        first_loadding.start()
  },
  methods:{
      upload_all:function(){
        var that =this;
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "更新数据",
        function(){
        var form = {}
        for(var key in that.edit_form)form[key] = that.edit_form[key]
        form["tags"] = form["tags"].join(";")
        // console.log(form)
        // $.ajax({
        //     type:"POST",
        //     url: config.server_host + "/api/paper/uploadone",
        //     async:false,
        //     data:{"id":that.id,"new_paper":form},
        //     dataType:"json",
        //     success:function(){

        //     }
        // });
        axios.post(
            config.server_host + "/api/paper/uploadone",
            {"id":that.id,"new_paper":form}
        ).then(
            returndata=>{
                console.log(returndata)
            }
        )
        })
        loadding.start();
      },
      handleClose:function(tag) {
        this.edit_form.tags.splice(this.edit_form.tags.indexOf(tag), 1);
      },

      showInput:function() {
        this.inputVisible = true;
        this.$nextTick(_ => {
            console.log(_)
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm:function() {
        let inputValue = this.inputValue.toLowerCase();
        if (inputValue) {
          this.edit_form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.paper_info{
    position: relative;
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
    margin: 10px 0;
    font-size: .8em;
    box-sizing: border-box;
    box-shadow: 5px 5px 10px rgba(0,0,0,.1);
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
</style>
