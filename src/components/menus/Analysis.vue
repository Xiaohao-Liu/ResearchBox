<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-data-analysis"></i>统计分析 </el-col>
        </el-row>
      <el-row :gutter=10 style="margin-top:10px;">
          <el-col :span="6" :xs="24"  style="margin-top:10px;">
            <el-card>
              <div class="analysis_title">总数：</div>
                <div class="num_item" v-for="item in items" :key="item.idx" v-on:click="$router.push(item.route)">
                  <i :class="item.icon"></i> {{item.title}}  <span class="num">{{nums[item.name]}}</span>
                </div>
            </el-card>
          </el-col>
          <el-col :span="18"  :xs="24"  style="margin-top:10px;">
            <el-card v-loading="paper_time_loading">
              <div class="analysis_title">发表时间分布</div>
                <div class="paper_board">
                  <div class="paper_month_line">1</div>
                  <div class="paper_month_line" v-for="i in 12" :key="i" :style="{top:'calc(180px / 12 * '+i+')'}">{{i!=12?(i+1):''}}</div>
                <div style="height: 100%;width: 100%;display: flex;justify-content: space-between;">
                  <div class="paper_time_line" v-for="line in paper_time" :key="line[0].year">
                  <div class="paper_time_title">{{line[0].year}}</div>
                  <div class="paper_time_month_bar" v-for="month in line" :key="month.month" :style="{top:'calc(100% / 12 * '+(month.month)+')',opacity:(month.count/5)}">
                  {{month.count}}
                  </div>
                </div>

                </div>
                </div>
            </el-card>
          </el-col>
      </el-row>
      <el-row  :gutter=10 style="margin-top:10px;">
        <el-col  :span="12"  :xs="24"  style="margin-top:10px;">
          <el-card style="height:464px;" id="tagGraphBoard">
            <div id='tagGraphCanvas'></div>
          </el-card>
        </el-col>
        <el-col :span="12"  :xs="24"  style="margin-top:10px;">
            <el-card class="top10" v-loading="tag_top10_loading">
              <div class="analysis_title">Tag TOP10：</div>
              <div class="top10_line" v-for="tag in tag_top10" :key="tag.id">
                 <el-row>
                  <el-col :span="20" >
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
      </el-row>

      <el-row :gutter=10 style="margin-top:10px;">
          <el-col :span="12"  :xs="24"  style="margin-top:10px;">
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
          <el-col :span="12"  :xs="24"  style="margin-top:10px;">
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
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
const axios = require('axios')
// import $ from "jquery"

// import ECharts modules manually to reduce bundle size
import echarts from 'echarts'
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/tooltip'
require('echarts/extension/dataTool')

// If you want to use ECharts extensions, just import the extension package, and it will work
// Taking ECharts-GL as an example:
// You only need to install the package with `npm install --save echarts-gl` and import it as follows
import 'echarts-gl'

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
              route:"/papermanager/1"
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
        paper_time:{},
        tag_top10:[],
        meeting_top10:[],
        table_top10:[], 
        tag_top10_loading:true,
        paper_time_loading:true,
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
        this.getPaperTimeLine();
        this.getTagTop10();
        this.getTableTop10();
        this.getMeetingTop10();
        this.getTagGraph()
        document.getElementsByTagName('title')[0].innerText = "分析";
  },
  methods:{
      getPaperTimeLine:function(){
        var that = this;
        that.paperRecents_loading=true;
        axios.get(
          config.server_host + "/api/analysis/timenums"
        ).then(
          returndata=>{
            
            for(var i =0;i<returndata.data.data.length;i++){
                let d = new Date(returndata.data.data[i]['Ptime']);
                  returndata.data.data[i]["year"] = d.getFullYear();
                  returndata.data.data[i]["month"] = (d.getMonth()+1)%12;
                  if(returndata.data.data[i]["year"] in that.paper_time){
                    that.paper_time[returndata.data.data[i]["year"]].push(returndata.data.data[i])
                  }else{
                    that.paper_time[returndata.data.data[i]["year"]]=[returndata.data.data[i]]
                  }
                  
                }
              console.log(that.paper_time)
            that.paper_time_loading=false;
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
      },

      getTagGraph:function(){
        var  categories = ['Tag'];
        var myChart = echarts.init(document.getElementById('tagGraphCanvas'));
        myChart.showLoading();
        var options = {
          title: {
            text: 'Tag Graph:',
            subtext: 'Force Layout',
            top: 'top',
            left: 'left'
        },
        tooltip: {},
        legend: [{
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: 'Tag',
                type: 'graph',
                layout: 'force',
                data: [],
                links: [],
                categories: categories,
                roam: 'move',
                label: {
                    position: 'bottom'
                },
                itemStyle: {
                  color:'rgb(63,81,181)',
                    borderColor: '#fff',
                    borderWidth: 1,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                force: {
                  initLayout:'circular',
                    repulsion: 50,
                    gravity:.1,
                    edgeLength: [10, 50],
                    friction :.1
                }
            }
        ]
      };
        axios.get(
            config.server_host + "/api/tag/get"
        ).then(res=>{
          // console.log(res)
          var graph = {nodes:[],links:[]};
          var linksDict = {};
          var paperDict={}
          var num = 0;
          res.data.data.forEach(ele=>{
            myChart.hideLoading();
            ele.graphidx = ele.id;
            ele.id = num;
            ele.name = ele.title.split('+').join(" ");
            ele.category= 0;
            
            graph.nodes.push(ele);
            ele.papers.split(";").forEach(p=>{
              if(!(p in paperDict)){
                paperDict[p]=new Set();
              }
              paperDict[p].forEach(prevTag=>{
                if(!(prevTag in linksDict)){
                  linksDict[prevTag]={count:0}
                }
                if(!(ele.id in linksDict)){
                  linksDict[ele.id]={count:0}
                }
                if(ele.id in linksDict[prevTag]){
                  linksDict[prevTag][ele.id]+=1;
                  linksDict[ele.id][prevTag]+=1;
                }else{
                  linksDict[prevTag][ele.id]=1;
                  linksDict[ele.id][prevTag]+=1;
                }
                linksDict[prevTag].count+=1;
                linksDict[ele.id].count+=1;
              })
              paperDict[p].add(ele.id);
            })
            num+=1;
          })
          num = 0;
          for(var target in linksDict){
            for(var source in linksDict[target]){
              if(source=="count"){
                graph.nodes[target].value=linksDict[target].count;
                graph.nodes[target].symbolSize=linksDict[target].count*3;
                // graph.nodes[target].label={show:graph.nodes[target].value>5?true:false}
                graph.nodes[target].itemStyle={
                  color:'rgb(63,81,181)',
                  opacity:(linksDict[target].count>5?1:linksDict[target].count/5),
                }
                continue;
              }
              graph.links.push({
                id:num,
                name: null,
                weight:linksDict[target][source],
                value:linksDict[target][source],
                source: source,
                target:target,
              });
              num+=1;
            }
          }
          // console.log(graph)
          options.series[0].data= graph.nodes;
          options.series[0].links= graph.links;
          myChart.setOption(options);
        })
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
  background: $--color-primary-50;
  color: white;
}
.paper_recent_title{
  height:30px;
  line-height: 30px;
  font-weight: bold;
  position: relative;
  cursor: pointer;
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
.top10{
  height:464px;
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
background: $--color-primary-50;
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
.paper_board{
  height: 210px;
  position: relative;
  width: 100%;
  margin: 10px 0px;
  padding-left: 20px;
  box-sizing: border-box;
  // overflow-x: scroll;
  .paper_month_line{
        position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 0px;
    border-top: 1px dashed #ddd;
        font-size: 10px;
    line-height: 12px;
    color: #999;
    // z-index: 1;
    text-indent: 0px;
  }

}
#main-app.dark-mode{
  .paper_time_line{
    background: rgba(68,68,68 ,.5);
  }
  .paper_month_line{
    border-top: 1px dashed #555;
  }
}
.paper_time_line{
      line-height: 300px;
    height: 180px;
    width: 100%;
    background: rgba(247,247,247 ,.5);
    border-radius: 3px;
    margin: 0px 10px;
        display: inline-block;
    position: relative;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    transition: ease .5s;
    .paper_time_title{
          position: absolute;
    bottom: -15px;
    text-align: center;
    font-size: 10px;
    line-height: 10px;
    width: 100%;
    height: 10px;
    left: 0px;
    }
    .paper_time_month_bar{
    width: 100%;
    position: absolute;
    left: 0px;
    height: calc(100% / 12);
    background: $--color-primary;
    opacity: 0;
        font-size: 8px;
    line-height: 14px;
    width: 100%;
    text-align: center;
    border-radius: 5px;
    color: white;
    }
}
.echarts {
  width: 100%;
  height: 100%;
}
#tagGraphBoard .el-card__body{
  height: 100%;
  width: 100%;
  // padding: 0;
  overflow: hidden;
  #tagGraphCanvas{
    height: 100%;
  width: 100%;
  }
}
</style>
