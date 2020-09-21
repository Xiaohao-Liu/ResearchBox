<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-select style="width:calc(100% - 20px);margin:10px;" v-model="select_meeting" :change="handlePush(select_meeting)" clearable autocomplete default-first-option filterable placeholder="请搜索">
        <el-option
        v-for="item in meetings_list"
        :key="item.split('+').join(' ')"
        :label="item.split('+').join(' ')"
        :value="item.split('+').join(' ')">
        </el-option>
    </el-select>
      <el-card class="meeting_list">
          <el-row>
            <el-col >
                <el-tag v-for="meeting in meetings_list" :key="meeting" v-show="meeting!=''" v-on:click="handlePush(meeting)" size="mini">{{meeting}}</el-tag>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="meeting_search">
          <el-row>
            <el-col >
                <el-tag v-for="meeting in search_meetings" :key="meeting" v-show="meeting!=''" closable @close="handleClose(meeting)">{{meeting}}</el-tag>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="paper" v-for="paper in paper_list" :key="paper.Ntime">
        <div slot="header" class="clearfix" style="cursor:pointer" v-on:click="$router.push('/papereditor/'+paper.md5_title)">
            <span>{{paper.title}}</span>
        </div>
        <div class="meeting">
            {{paper.meeting}}
        </div>
        <el-row>
            <el-col :span="12" class="ptime">
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
const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");

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
        search_meetings:[],
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
      $.ajax({
            type:"GET",
            url: config.server_host + "/api/meeting/get",
            async:false,
            dataType:"json",
            success:function(returndata){
                that.meetings_list = returndata.data;
            }
        });
        })
        first_loadding.start()
  },
  methods:{
    handleClose(meeting) {
        this.search_meetings.splice(this.search_meetings.indexOf(meeting), 1);
        this.get_papers_by_search_meetings();
    },
    handlePush(meeting) {
        if(this.search_meetings.indexOf(meeting)>=0)return;
        this.search_meetings.push(meeting);
        this.get_papers_by_search_meetings();
    },

    get_papers_by_search_meetings:function(){
        var that = this;
        if(that.search_meetings.length==0){return;}
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "获取Paper数据",
        function(){
        $.ajax({
            type:"POST",
            url: config.server_host + "/api/meeting/paper_by_meetings",
            async:false,
            data:{meetings:that.search_meetings},
            dataType:"json",
            success:function(returndata){
                console.log(returndata)
                that.paper_list=[]
                for(var i = 0; i< returndata.data.length;i++){
                    if(returndata.data[i] ==null)continue;
                    if(returndata.data[i]['tags'] != ''){
                        returndata.data[i]['tags'] = returndata.data[i]['tags'].split(';');
                    }else returndata.data[i]['tags']=[]
                    that.paper_list.push(returndata.data[i]);
                }
            }
        });
        })
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.meeting_list{

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
</style>
