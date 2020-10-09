<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-data-analysis"></i>统计分析 </el-col>
        </el-row>
      <el-row :gutter=10 style="margin-top:10px;">
          <el-col :span="6" :xs="24">
            <el-card>
              <div class="analysis_title">总数：</div>
                <div class="num_item" v-for="item in items" :key="item.idx" v-on:click="$router.push(item.route)">
                  <i :class="item.icon"></i> {{item.title}}  <span class="num">{{nums[item.name]}}</span>
                </div>
            </el-card>
          </el-col>
          <el-col :span="18"  :xs="24">
            <el-card v-loading="paperRecents_loading">
              <div class="analysis_title">最近编辑：</div>
              <el-row class="paper_recent"  v-for="paper in paperRecents" :key="paper.id">
                <div class="paper_recent_process" v-bind:style="{width:paper.process+'%'}"></div>
                <el-col class="paper_recent_title text_wrap" :span="16">{{paper.title}}</el-col>
                <el-col class="paper_recent_author text_wrap" :span="4"><i class='el-icon-user'></i> {{paper.author1}}</el-col>
                <el-col class="paper_recent_updatedAt" :span="4" >{{paper.updatedAt.getFullYear()}}-{{paper.updatedAt.getMonth()}}-{{paper.updatedAt.getDate()}} {{paper.updatedAt.getHours()}}:{{paper.updatedAt.getMinutes()}}</el-col>
              </el-row>
            </el-card>
          </el-col>
      </el-row>
      <el-row :gutter=10 style="margin-top:10px;">
          <el-col :span="8"  :xs="24">
            <el-card class="top10" v-loading="tag_top10_loading">
              <div class="analysis_title">Tag TOP10：</div>
              <div class="top10_line" v-for="tag in tag_top10" :key="tag.id">
                 <el-row>
                  <el-col :span="20">
                    <div class="top10_title">{{tag.title==null?'':tag.title.split('+').join(' ')}}</div>
                  </el-col>
                  <el-col :span="4">
                        <div class="top10_nums">{{tag.nums}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                  <div class="top10_bar" v-bind:style="{width:(tag.nums / tag_top10[0].nums)*100 + '%'}"></div>
                  </el-col>

                </el-row>       
              </div>
            </el-card>
          </el-col>
          <el-col :span="8"  :xs="24">
            <el-card class="top10" v-loading="meeting_top10_loading">
              <div class="analysis_title">Meeting TOP10：</div>
              <div class="top10_line" v-for="meeting in meeting_top10" :key="meeting.id">
                <el-row>
                  <el-col :span="20">
                    <div class="top10_title">{{meeting.title}}</div>
                  </el-col>
                  <el-col :span="4">
                        <div class="top10_nums">{{meeting.nums}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                  <div class="top10_bar" v-bind:style="{width:(meeting.nums / meeting_top10[0].nums)*100 + '%'}"></div>
                  </el-col>

                </el-row>  
              </div>
            </el-card>
          </el-col>
          <el-col :span="8"  :xs="24">
            <el-card class="top10" v-loading="table_top10_loading">
              <div class="analysis_title">Table TOP10：</div>
              <div class="top10_line" v-for="table in table_top10" :key="table.id">
                <el-row>
                  <el-col :span="20">
                    <div class="top10_title">{{table.title}}</div>
                  </el-col>
                  <el-col :span="4">
                        <div class="top10_nums">{{table.nums}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                  <div class="top10_bar" v-bind:style="{width:(table.nums / table_top10[0].nums)*100 + '%'}"></div>
                  </el-col>
                </el-row>          
              </div>
            </el-card>
          </el-col>
      </el-row>
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
const axios = require('axios')
export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
        select_tag:"",
        nums:{
            paper:0,
            meeting:0,
            plan:0,
            tag:0
          },
        items:[
          {
              idx:0,
              title:"Paper",
              name:"paper",
              icon:"el-icon-paperclip",
              route:"/papermanager"
          },
          {
              idx:1,
              title:"标签",
              name:'tag',
              icon:"el-icon-price-tag",
              route:"/tagmanager"
          },
          {
              idx:2,
              title:"会议",
              name:'meeting',
              icon:"el-icon-receiving",
              route:"/meetingmanager"
          },
          {
              idx:3,
              title:"计划",
              name:'plan',
              icon:"el-icon-s-order",
              route:"/planmanager"
          },
        ],

        paperRecents:[],
        tag_top10:[],
        meeting_top10:[],
        table_top10:[], 
        paperRecents_loading:true,
        tag_top10_loading:true,
        meeting_top10_loading:true,
        table_top10_loading:true, 
    }
  },
  mounted:function(){
      var that =this;
      var first_loadding = new Loadding();
    first_loadding.add_title("数据分析");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数量统计",
        async function(){
        var returndata = await axios.get(
          config.server_host + "/api/analysis/nums"
        );
            that.nums.paper = returndata.data.data[0];
            that.nums.meeting = returndata.data.data[1];
            that.nums.tag = returndata.data.data[2];
            that.nums.plan = returndata.data.data[3];
        })
        first_loadding.start();
        this.getPaperRecent();
        this.getTagTop10();
        this.getTableTop10();
        this.getMeetingTop10();
  },
  methods:{
      getPaperRecent:function(){
        var that = this;
        that.paperRecents_loading=true;
        axios.get(
          config.server_host + "/api/analysis/paperrecents"
        ).then(
          returndata=>{
            for(var i =0;i<returndata.data.data.length;i++){
                  returndata.data.data[i]['updatedAt'] = new Date(returndata.data.data[i]['updatedAt']);
                  that.paperRecents.push(returndata.data.data[i])
                }
            that.paperRecents_loading=false;
          }
        )
      },
      getTagTop10:function(){
        var that = this;
        that.tag_top10_loading=true;
        axios.get(
          config.server_host + "/api/analysis/tag_top10"
        ).then(
          returndata=>{
                for(var i =0;i<returndata.data.data.length;i++){
                  that.tag_top10.push(returndata.data.data[i])
                }
                that.tag_top10_loading=false;
          }
        )
      },
      getMeetingTop10:function(){
        var that = this;
        that.meeting_top10_loading=true;
        axios.get(
          config.server_host + "/api/analysis/meeting_top10"
        ).then(
          returndata=>{
                for(var i =0;i<returndata.data.data.length;i++){
                  that.meeting_top10.push(returndata.data.data[i])
                }
                that.meeting_top10_loading=false;
          }
        )
      },
      getTableTop10:function(){
        var that = this;
        that.table_top10_loading=true;
        axios.get(
          config.server_host + "/api/analysis/table_top10"
        ).then(
          returndata=>{
                for(var i =0;i<returndata.data.data.length;i++){
                  that.table_top10.push(returndata.data.data[i])
                }
                that.table_top10_loading=false;
          }
        )
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.analysis_title{
      font-weight: bold;
    font-size: 14px;
}
.text_wrap{
      white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.num_item{
    height: 40px;
    background: rgba(0, 0, 0, 0.03);
    padding: 5px 10px;
    line-height: 40px;
    margin: 6px 0px;
    border-radius: 5px;
    transition: ease .5s;
    cursor: pointer;
}
.num_item:hover{
  background: $--color-primary;
  color:white;
}
.num_item .num{
      float: right;
    font-weight: bold;
}
.paper_recent{
  height: 30px;
    background: rgba(0,0,0,.03);
    padding: 5px 10px !important;
    line-height: 30px;
    box-sizing: unset !important;
    margin: 5px 0px;
    border-radius: 5px;
    transition:ease .5s;
}
.paper_recent:hover{
  background: #00897B;
  color: white;
}
.paper_recent_title{
  height:30px;
  line-height: 30px;
  font-weight: bold;
  position: relative;
}
.paper_recent_author{
  height:30px;
  line-height: 30px;
  position: relative;
    font-size: 14px;
}
.paper_recent_updatedAt{
  height:30px;
  overflow: hidden;
  line-height: 30px;
  font-size:10px;
  position: relative;
}
.paper_recent_process{
      height: 100%;
    position: absolute;
    width: 100px;
    background: $--color-primary;
    top: 0px;
    left: 0px;
    z-index: 0;
    opacity: .5;
    border-radius: 5px;
}
.top10 .top10_line{
      height: auto;
    line-height: 20px;
    background: rgba(0,0,0,.02);
    border-radius: 5px;
    padding: 5px 5px;
    margin:2px 0px;
    transition:ease .5s;
}
.top10 .top10_line:hover{
 background: $--color-primary;
 color: white;
}
.top10 .top10_line:hover .top10_bar{
 background: white;
}
.top10_line .top10_title{
background: #4DB6AC;
    border-radius: 10px;
    color: white;
    padding: 0px 10px;
    font-size: 10px;
    float: left;
}
.top10_line .top10_bar{
      width: 10px;
    height: 5px;
    background: $--color-primary;
    border-radius: 10px;
    margin-top: 3px;
    transition: ease .5s;
    // margin-left: 10px;
}
.top10_line .top10_nums{
    font-size: 10px;
    margin-left: 15px;
    font-weight: bold;
}
</style>
