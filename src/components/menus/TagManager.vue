<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-price-tag"></i>标签管理 </el-col>
        </el-row>
      <el-select style="width:calc(100% - 20px);margin:10px;" v-model="select_tag" :change="handlePush(select_tag)" clearable autocomplete default-first-option filterable placeholder="请搜索">
        <el-option
        v-for="item in tags_list"
        :key="item.id"
        :label="item.title==null?'':item.title.split('+').join(' ')"
        :value="item.id">
        </el-option>
    </el-select>
      <el-card class="tag_list">
          <el-row>
            <el-col >
                <el-badge  class="nums" v-for="tag in tags_list" :key="tag.id" :value="tag.nums" type="primary">

                <el-tag  v-show="tag!=''" v-on:click="handlePush(tag.id)" size="mini">{{tag.title==null?'':tag.title.split('+').join(' ')}}</el-tag>
                </el-badge>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="tag_search">
          <el-row>
            <el-col >
                <el-tag v-for="tag in search_tags" :key="tag.id" v-show="tag!=''" closable @close="handleClose(tag.id)">{{tag_id_title[tag.id]==null?'':tag_id_title[tag.id].split('+').join(' ')}}</el-tag>
            </el-col>
        </el-row>
      </el-card>
         <el-card :class="'paper'+(paper.process==100?' finished':'')" v-for="paper in paper_list" :key="paper.Ntime">
        <div slot="header" class="clearfix" style="cursor:pointer" v-on:click="$router.push('/papereditor/'+paper.id)">
            <span>{{paper.title}}</span>
        </div>
        <div class="meeting">
            {{paper.meeting}}
        </div>
        <el-row>
            <el-col :span="24" class="ptime">
                <span style="font-size:10px;color:#999;">submitted:</span> {{new Date(parseInt(paper.Ptime)).getMonth()+1}},{{new Date(parseInt(paper.Ptime)).getFullYear()}} 
            </el-col>
        </el-row>
        <!-- <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
        </div> -->
        
        <el-row>
            <el-col :span="24"  v-for="tag in paper.tags" :key="tag">
                <el-tag class='micro_tag'>{{tag}}</el-tag>
            </el-col>
        </el-row>
        <div class="status_bar" v-bind:style="{width:paper.process + '%'}"></div>
    </el-card>
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
    //         url: config.server_host + "/api/tag/get",
    //         async:false,
    //         dataType:"json",
    //         success:function(returndata){
    //             console.log(returndata)
    //             for(let i = 0; i < returndata.data.data.length;i++){
    //                 that.tags_list.push(returndata.data.data[i])
    //                 that.tag_id_title[returndata.data.data[i].id] = returndata.data.data[i].title;
    //             }
    //         }
    //     });
        axios.get(
            config.server_host + "/api/tag/get"
        ).then(
            returndata=>{
                console.log(returndata)
                for(let i = 0; i < returndata.data.data.length;i++){
                    that.tags_list.push(returndata.data.data[i])
                    that.tag_id_title[returndata.data.data[i].id] = returndata.data.data[i].title;
                }
            }
        );
        })
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

    get_papers_by_search_tags:function(){
        var that = this;
        if(that.search_tags.length==0){return;}
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "获取Paper数据",
        function(){
        // $.ajax({
        //     type:"POST",
        //     url: config.server_host + "/api/tag/paper_by_tags",
        //     async:false,
        //     data:{tags:that.search_tags_id},
        //     dataType:"json",
        //     success:function(returndata){
        //         console.log(returndata)
        //         that.paper_list=[]
        //         for(var i = 0; i< returndata.data.data.length;i++){
        //             if(returndata.data.data[i] ==null)continue;
        //             if(returndata.data.data[i]['tags'] != ''){
        //                 returndata.data.data[i]['tags'] = returndata.data.data[i]['tags'].split(';');
        //             }else returndata.data.data[i]['tags']=[]
        //             returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
        //             that.paper_list.push(returndata.data.data[i]);
        //         }
        //     }
        // });
        axios.post(
            config.server_host + "/api/tag/paper_by_tags",
            {tags:that.search_tags_id}
        ).then(
            returndata=>{
                console.log(returndata)
                that.paper_list=[]
                for(var i = 0; i< returndata.data.data.length;i++){
                    if(returndata.data.data[i] ==null)continue;
                    if(returndata.data.data[i]['tags'] != ''){
                        returndata.data.data[i]['tags'] = returndata.data.data[i]['tags'].split(';');
                    }else returndata.data.data[i]['tags']=[]
                    returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
                    that.paper_list.push(returndata.data.data[i]);
                }
            }
        );
        });
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.tag_list{

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
