<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-header class="top_bar">
        <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-paperclip"></i>Paper管理 </el-col>
        </el-row>
    </el-header>
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-document-add" style="float: left;" v-on:click="show_add_paper=!show_add_paper">添加Paper</el-button>
        <el-card class="add_board" v-show="show_add_paper">
            <el-form label-position="top" label-width="80px" :model="add_form" :rules="rules">
                <el-form-item label="标题" prop="add_title">
                    <el-input v-model="add_form.title"></el-input>
                </el-form-item>
                <el-form-item label="第一作者" prop="add_author">
                    <el-input v-model="add_form.author1"></el-input>
                </el-form-item>
                <el-form-item label="发表时间">
                    <el-row>
                        <el-col :span="12" class="block">
                            <el-date-picker
                            v-model="add_form.Ptime"
                            type="year"
                            value-format="timestamp"
                            placeholder="选择年">
                            </el-date-picker>
                        </el-col>
                            <el-col :span="12" class="block">
                                <el-date-picker
                                v-model="add_form.Ptime"
                                type="month"
                                value-format="timestamp"
                                placeholder="选择月">
                                </el-date-picker>
                            </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add_paper">立即添加</el-button>
                    <el-button v-on:click="show_add_paper=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-col :span="4" style="line-height:40px;padding:0px 10px;"><el-checkbox v-model="include_finished" @change="change_finished">已完成</el-checkbox></el-col>
        <el-col :span="12" :xs="24" class="under_search_bar">
            <el-select style="width:calc(100% - 20px);" v-model="select_paper_lite" :change="handlePush(select_paper_lite)" clearable autocomplete default-first-option filterable placeholder="请搜索">
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
        </el-col>
    </el-row>
    <el-card  :class="'paper'+(paper.process==100?' finished':'')" v-for="paper in paper_list" :key="paper.id" v-show="(paper.process!=100 || include_finished)">
        <el-row :gutter="10">
            <el-col :span="(paper.background!=null && paper.background!='')?8:0" :xs="24">
                <div v-show="paper.background!=null && paper.background!=''" class="paper_img" style="border-radius:5px;" :style="{backgroundImage:'url('+paper.background+')'}"/>
            </el-col>
            <el-col :span="(paper.background!=null && paper.background!='')?16:24"  :xs="24">
                <div  class="paper_head" style="cursor:pointer" v-on:click="$router.push('/papereditor/'+paper.id)">
            <span>{{paper.title}}</span>
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
    <el-row style="position: fixed;bottom: 10px;right:80px;z-index: 10;">
        <el-col :span="24" class='pagination_board' >
            <el-pagination
            background
            :current-page="parseInt(pagenum)"
            layout="prev, pager, next"
            :page-size="papers_per_page"
            :total="paper_lite_list.length"
            @current-change="toPage">
            </el-pagination>
        </el-col>
    </el-row>
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
const axios = require('axios');

export default {
    inject:['reload'],
  name: 'login',
  props: ["pagenum"],
  data(){
    var checkNull = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('该项不能为空'));
        }else{
            callback();
        }
    }
    return {
        show_add_paper:false,
        show_add_to_table:false,
        include_finished:true,
        now_tables:[],
        now_tables_title:[],
        add_to_table:{
            paper_title:"",
            paper_id:"",
            table_title:"",
            table_id:"",
        },

        add_form:{
            title:"",
            author1:"",
            Ptime:"",
            PtimeYear:"",
            PtimeMon:""
        },
        paper_list:[],
        paper_lite_list:[],
        select_paper_lite:'',
        papers_per_page:config.papers_per_page,
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
      that.include_finished = localStorage.getItem("RSB_paperManager_finished") == "true"?true:false;
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取paper数据",
        async function(){
            var returndata = await axios.get(
                config.server_host + "/api/paper/by_page/"+that.pagenum
            );
                    console.log(returndata)
                    for(var i = 0; i< returndata.data.data.length;i++){
                        if(returndata.data.data[i] ==null)continue;
                        if(returndata.data.data[i]['tags'] != null){
                            returndata.data.data[i]['tags'] = returndata.data.data[i]['tags']==''?[]:returndata.data.data[i]['tags'].split(';');
                        }else returndata.data.data[i]['tags']=[]
                        returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
                        that.paper_list.push(returndata.data.data[i]);
                    }
        }
    );
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
    first_loadding.add_process(
        "拉取table数据",
        async function(){
            var returndata = await axios.get(
                config.server_host + "/api/plan/by_ntime"
            );
                    for(var i in returndata.data.data){
                        that.now_tables.push({"id":returndata.data.data[i].id,"title":returndata.data.data[i].title})
                        that.now_tables_title.push(returndata.data.data[i].title);
                    }
        }
    );
    first_loadding.start();
     
  },
  methods:{
      handlePush(paperid) {
        if(String(paperid)=='' || String(paperid)=='-1')return;
        this.$router.push('/papereditor/'+paperid)
    },
    toPage:function(pageidx){
        this.$router.push('/papermanager/'+pageidx);
        this.reload()
    },
      add_paper:function(){
          var that = this;
          console.log(that.add_form);
          var loadding = new Loadding();
            loadding.add_title("初始化");
            loadding.__init__();
            loadding.add_process(
                "添加Paper",
                async function(){
                await axios.post(
                    config.server_host + "/api/paper/add",
                    {"title":that.add_form.title,"author1":that.add_form.author1,"Ptime":that.add_form.Ptime}
                );
                that.show_add_paper=false;
                that.reload();
            })
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
            "删除Paper",
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
      },
      change_finished:function(changedValue){
          localStorage.setItem("RSB_paperManager_finished",String(changedValue));
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
</style>
