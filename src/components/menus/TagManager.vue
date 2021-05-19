<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-header class="top_bar">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-price-tag"></i> 标签管理 </el-col>
        </el-row>
      </el-header>
      <el-select class="ops" v-model="select_tag" :change="handlePush(select_tag)" clearable autocomplete default-first-option filterable placeholder="请搜索">
        <el-option
        v-for="item in tags_list"
        :key="item.id"
        :label="item.title==null?'':item.title.split('+').join(' ')"
        :value="item.id">
        </el-option>
    </el-select>
      <el-card class="paper tag_list">
          <el-row>
            <el-col >
                <el-badge  class="nums" v-for="tag in tags_list" :key="tag.id" :value="tag.nums" type="primary">

                <el-tag  v-show="tag!=''" v-on:click="handlePush(tag.id)" size="mini">{{tag.title==null?'':tag.title.split('+').join(' ')}}</el-tag>
                </el-badge>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="paper tag_search">
          <el-row>
            <el-col >
                <el-tag v-for="tag in search_tags" :key="tag.id" v-show="tag!=''" closable @close="handleClose(tag.id)">{{tag_id_title[tag.id]==null?'':tag_id_title[tag.id].split('+').join(' ')}}</el-tag>
            </el-col>
        </el-row>
      </el-card>
         <el-card :class="'paper'+(paper.process==100?' finished':'')" v-for="paper in paper_list" :key="paper.Ntime">
        <el-row :gutter="10">
            <el-col :span="(paper.background!=null && paper.background!='')?8:0" :xs="24">
                <div v-show="paper.background!=null && paper.background!=''" class="paper_img" style="border-radius:5px;cursor:zoom-in;" @click="scale">
                <img :src="paper.background"/></div>
            </el-col>
            <el-col :span="(paper.background!=null && paper.background!='')?16:24"  :xs="24">
                <div  class="paper_head" style="cursor:pointer" v-on:click="$router.push('/papereditor/'+paper.id)">
            <span>{{paper.title}}</span>  <span style="background:rgba(0,0,0,.1);padding:0px 10px;border-radius:5px;font-size:10px;">{{paper.id}}</span>
        </div>
        <div class="meeting">
            {{paper.meeting}}
        </div>
        <el-row>
            <el-col :span="12" class="ptime">
                <span style="font-size:10px;color:#999;">submitted:</span> {{new Date(parseInt(paper.Ptime)).getMonth()+1}},{{new Date(parseInt(paper.Ptime)).getFullYear()}} 
            </el-col>
            <el-col :span="12" style="text-align:right;">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary" icon="el-icon-menu" class="paper_dropdown_btn" circle>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-bind:command="{'type':'d','params':paper.id}" >删除</el-dropdown-item>
                        <el-dropdown-item v-bind:command="{'type':'e','params':paper.id}" >编辑</el-dropdown-item>
                        <el-dropdown-item v-bind:command="{'type':'a','param1':paper.id,'param2':paper.title}" >添加至...</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
            </el-col>
        </el-row>
        <!-- <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
        </div> -->
        
        <el-row>
            <el-tag class='micro_tag'  v-for="tag in paper.tags" :key="tag">{{tag}}</el-tag>
            <!-- <el-col :span="24" >
                
            </el-col> -->
        </el-row>
        <el-row style="margin-top:10px;">
            <el-tag class='table_tag'  v-for="tag in paper.tables" :key="tag" v-show="now_tables[now_tables_map[tag]]">{{now_tables[now_tables_map[tag]]?now_tables[now_tables_map[tag]].title:''}}</el-tag>
            <!-- <el-col :span="24" >
                
            </el-col> -->
        </el-row>
            </el-col>
        </el-row>
        <div class="status_bar" v-bind:style="{width:paper.process + '%'}"></div>
    </el-card>
    <el-card class="add_to_table" v-show="show_add_to_table">
        <el-row>
            <el-col :span="24" style="text-align:center;font-size:1.2em;font-weight:bold;">添加至</el-col>
        </el-row>
        <el-row>
            <el-col :span="24" style="font-size:10px;margin-top:10px;">Paper: <strong>{{add_to_table.paper_title}}</strong></el-col>
        </el-row>
        <el-row>
            <el-col :span="24" style="font-size:10px;margin-top:10px;">Table: <strong>{{add_to_table.table_title}}</strong></el-col>
        </el-row>
        <el-row>
            <el-collapse style="margin:10px 0px;" accordion>
                <el-collapse-item title="选择需要添加至的Table">
                    <el-tag style="cursor:pointer;" v-for="table in now_tables" :key="table.id" v-on:click="add_to_table_table(table.title,table.id)">{{table.title}}</el-tag>
                </el-collapse-item>
            </el-collapse>
        </el-row>
        <el-row>
            <el-button type="primary" @click="add_to_table_fun">立即添加</el-button>
            <el-button v-on:click="show_add_to_table=false">取消</el-button>
        </el-row>
    </el-card>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
const axios = require('axios');

export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
        select_tag:"",
        tags_list:[],
        tag_id_title:{},
        search_tags:[],
        search_tags_id:[],
        paper_list:[],
        show_add_to_table:false,
        add_to_table:{
            paper_title:"", 
            paper_id:"",
            table_title:"",
            table_id:"",
        },
        now_tables:[],
        now_tables_title:[],
        now_tables_map:{}
    }
  },
  mounted:function(){
      var that =this;
      var first_loadding = new Loadding();
      document.getElementsByTagName('title')[0].innerText = "标签";
    first_loadding.add_title("初始化");
    
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数据",
        async function(){

        var returndata = await axios.get(
            config.server_host + "/api/tag/get"
        );
        for(let i = 0; i < returndata.data.data.length;i++){
            that.tags_list.push(returndata.data.data[i])
            that.tag_id_title[returndata.data.data[i].id] = returndata.data.data[i].title;
        }
    })
    first_loadding.add_process(
        "拉取table数据",
        async function(){
            var returndata = await axios.get(
                config.server_host + "/api/plan/by_ntime"
            );
            returndata.data.data.forEach((i,idx)=>{
                that.now_tables.push({"id":i.id,"title":i.title})
                that.now_tables_title.push(i.title);
                that.now_tables_map[i.id] = idx;
            })
        }
    );
    first_loadding.start();
  },
  methods:{
    handleClose(tagid) {
        this.search_tags.splice(this.search_tags_id.indexOf(tagid), 1);
        this.search_tags_id.splice(this.search_tags_id.indexOf(tagid), 1);
        this.get_papers_by_search_tags()
    },
    handlePush(tagid) {
        if(String(tagid)=='')return;
        if(this.search_tags_id.indexOf(tagid)>=0)return;
        this.search_tags.push({id:tagid});
        this.search_tags_id.push(tagid);
        this.get_papers_by_search_tags();
    },
    scale:function(event){
          var scale_ele = event.currentTarget;
          $(scale_ele).addClass("img_scale");
          var cover = $("<div style='position:fixed;top:0px;left:0px;height:100%;width:100%;z-index:100000001;cursor: zoom-out;'></div>");
          $("body").append(cover);
          cover.on("click",function(){
                $(scale_ele).removeClass("img_scale");
                cover.remove();
          })
      },
    get_papers_by_search_tags:function(){
        var that = this;
        if(that.search_tags.length==0){return;}
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "获取Paper数据",
        async function(){
        var returndata = await axios.post(
            config.server_host + "/api/tag/paper_by_tags",
            {tags:that.search_tags_id}
        );
                console.log(returndata)
                that.paper_list=[]
                for(var i = 0; i< returndata.data.data.length;i++){
                    if(returndata.data.data[i] ==null)continue;
                    if(returndata.data.data[i]['tags'] != ''){
                        returndata.data.data[i]['tags'] = returndata.data.data[i]['tags'].split(';');
                    }else returndata.data.data[i]['tags']=[]
                    if(returndata.data.data[i]['tables'] != null){
                        returndata.data.data[i]['tables'] = returndata.data.data[i]['tables']==''?[]:returndata.data.data[i]['tables'].split(';');
                    }else returndata.data.data[i]['tables']=[]
                    returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
                    that.paper_list.push(returndata.data.data[i]);
                }
        });
        loadding.start();
    },
    del_paper:function(id){
        var that = this;
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
    "删除Paper",
    async function(){
    await axios.post(
        config.server_host + "/api/paper/del",
        {"id":id}
    );
            that.reload();
    })
    loadding.start();
    },
    handleCommand:function(command){
        if(command.type=='e'){
            this.$router.push('/papereditor/'+command.params);
            return;
        }
        if(command.type=='d'){
            this.del_paper(command.params);
            return;
        }
        if(command.type=="a"){
            this.add_to_table_paper(command.param2,command.param1);
            this.show_add_to_table=true;
            return;
        }
    },
    add_to_table_table:function(title, id){
        this.add_to_table.table_title = title;
        this.add_to_table.table_id= id;
    },
    add_to_table_paper:function(title, id){
        this.add_to_table.paper_title = title;
        this.add_to_table.paper_id= id;
    },
    add_to_table_fun:function(){
        if(this.add_to_table.paper_id=="" || this.add_to_table.table_id == ""){
            this.$notify.error({
            title: '添加至...',
            message: '信息不全'
            });
            return;
        }
        var that = this;
        console.log(that.add_to_table)
        var loadding = new Loadding();
        loadding.add_title("初始化");
        loadding.__init__();
        loadding.add_process(
        "添加Paper到table",
        async function(){

        await axios.post(
            config.server_host + "/api/paper/add_paper_table",
            {"paperid":that.add_to_table.paper_id,"tableid":that.add_to_table.table_id}
        );
                that.$notify({
                    title: '成功',
                    message: that.add_to_table.paper_title+"\nTO\n"+that.add_to_table.table_title
                    });
                that.show_add_to_table = false;
        })
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
</style>
