<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-receiving"></i>会议管理 </el-col>
        </el-row>
      <el-select style="width:calc(100% - 20px);margin:10px;" v-model="select_meeting" :change="handlePush(select_meeting)" clearable autocomplete default-first-option filterable placeholder="请搜索">
        <el-option
        v-for="item in meetings_list"
        :key="item.id"
        :label="item.title==null?'':item.title.split('+').join(' ')"
        :value="item.id">
        </el-option>
    </el-select>
      <el-card class="meeting_list">
          <el-row>
            <el-col >
                    <el-badge  class="nums" v-for="meeting in meetings_list" :key="meeting.id" :value="meeting.nums" type="primary">
                        <el-tag v-show="meeting!=''" v-on:click="handlePush(meeting.id)" size="mini">{{meeting.title==null?'':meeting.title.split('+').join(' ')}}</el-tag>
                    </el-badge>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="meeting_search">
          <el-row>
            <el-col >
                <el-tag v-for="meeting in search_meetings" :key="meeting" v-show="meeting!=''" closable @close="handleClose(meeting.id)">{{meeting_id_title[meeting.id]==null?'':meeting_id_title[meeting.id].split('+').join(' ')}}</el-tag>
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
        select_meeting:"",
        meetings_list:[],
        meeting_id_title:{},
        search_meetings:[],
        search_meetings_id:[],
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
        async function(){
        var returndata = await axios.get(
            config.server_host + "/api/meeting/get"
        );
                for(let i = 0; i < returndata.data.data.length;i++){
                    that.meetings_list.push(returndata.data.data[i])
                    that.meeting_id_title[returndata.data.data[i].id] = returndata.data.data[i].title;
                }
        })
        first_loadding.start()
  },
  methods:{
    handleClose(meetingid) {
        this.search_meetings.splice(this.search_meetings_id.indexOf(meetingid), 1);
        this.search_meetings_id.splice(this.search_meetings_id.indexOf(meetingid), 1);
        this.get_papers_by_search_meetings();
    },
    handlePush(meetingid) {
        if(String(meetingid)=='')return;
        if(this.search_meetings_id.indexOf(meetingid)>=0)return;
        this.search_meetings.push({id:meetingid});
        this.search_meetings_id.push(meetingid);
        this.get_papers_by_search_meetings();
    },

    get_papers_by_search_meetings:function(){
        var that = this;
        if(that.search_meetings.length==0){return;}
        var loadding = new Loadding();
    loadding.add_title("Papers");
    loadding.__init__();
    loadding.add_process(
        "获取Paper数据",
        async function(){
        var returndata = await axios.post(
            config.server_host + "/api/meeting/paper_by_meetings",
            {meetings:that.search_meetings_id}
        );
                that.paper_list=[]
                for(var i = 0; i< returndata.data.data.length;i++){
                    if(returndata.data.data[i] ==null)continue;
                    if(returndata.data.data[i]['tags'] != ''){
                        returndata.data.data[i]['tags'] = returndata.data.data[i]['tags'].split(';');
                    }else returndata.data.data[i]['tags']=[]
                    returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
                    that.paper_list.push(returndata.data.data[i]);
                }
        })
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">

</style>
