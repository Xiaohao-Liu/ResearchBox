<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-s-order"></i>计划管理 </el-col>
        </el-row>
    <!-- {{editForm}} -->
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-back" v-on:click="$router.push('/planmanager')" circle></el-button>
        <el-button type="primary" icon="el-icon-finished" v-on:click="upload_all_changes()" circle></el-button>
    </el-row>
    <el-row>
        <el-col>

        </el-col>
    </el-row>
    <el-card>
        <div class="plan_process" v-bind:style="{width:everageWidth+'%'}"></div>
      <el-table
        :data="paper_list"
        style="width: 100%"
        :default-sort = "{prop: 'Ntime', order: 'descending'}"
        >
        <el-table-column
        prop="Ntime"
        label="新建日期"
        sortable
        :width="180"
        :formatter="Ntime_formate">
        </el-table-column>
        <el-table-column
        prop="Ptime"
        label="发布日期"
        sortable
        :width="180"
        :formatter="Ptime_formate">
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题"
        >
        <template slot-scope="scope">
            <strong class="text_wrap" style="cursor:pointer;" @click="$router.push('/papereditor/'+scope.row.id)">{{scope.row.title}}</strong>
            <!-- <span style="background:red;">{{ scope.row.process }}</span> -->
        </template>
        </el-table-column>
        <el-table-column
        prop="process"
        label="进度"
        sortable
        :width="180"
        >
        <template slot-scope="scope">
            <el-progress :width="40" :stroke-width="3" type="dashboard" :percentage="scope.row.process"></el-progress>
            <!-- <span style="background:red;">{{ scope.row.process }}</span> -->
        </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        :width="120">
        <template slot-scope="scope">
            <el-button
            @click.native.prevent="deleteRow(scope.row.id)"
            type="text"
            size="small">
            移除
            </el-button>
        </template>
        </el-table-column>
    </el-table>  
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
  name: 'plan',
  props: 
    ['id'],
  
  data(){
    return {
        everageWidth:0,
        show_add_paper:false,
        not_inited:false,
        editForm:{
            Ntime:"",
            title:"",
            papers:[]
        },
        paper_list:[]
    }
  },
  mounted:function(){
      var that =this;
      var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "初始化数据",
        async function(){
        
        var returndata = await axios.get(
            config.server_host + "/api/plan/fetchone/"+that.id
        );
                var data = returndata.data.data[0];
                that.editForm["Ntime"] = data["Ntime"];
                that.editForm["title"] = data["title"];
                that.editForm["papers"] = data["papers"]==""?[]:data["papers"].split(";");
                console.log(that.editForm)
                axios.post(
                    config.server_host + "/api/plan/paper_by_table",
                    {ids:that.editForm["papers"]}
                ).then(
                    returndata=>{
                        that.paper_list=[]
                        var sum_process = 0;
                        for(var i = 0; i< returndata.data.data.length;i++){
                            if(returndata.data.data[i] ==null)continue;
                            if(returndata.data.data[i]['tags'] != ''){
                                returndata.data.data[i]['tags'] = returndata.data.data[i]['tags'].split(';');
                            }else returndata.data.data[i]['tags']=[]
                            returndata.data.data[i]['Ptime'] = new Date(returndata.data.data[i]['Ptime']).getTime();
                            returndata.data.data[i]['Ntime'] = new Date(returndata.data.data[i]['Ntime']).getTime();
                            returndata.data.data[i]['process'] = parseInt(returndata.data.data[i]['process']);
                            sum_process = sum_process +  returndata.data.data[i]['process'];
                            that.paper_list.push(returndata.data.data[i]);
                        }
                        that.everageWidth = sum_process / returndata.data.data.length;
                    }
                )
        })
        first_loadding.start()
  },
  methods:{
    Ntime_formate:function(row){
        var date = new Date(parseInt(row.Ntime));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        return Y+M+D;
    },
    Ptime_formate:function(row){
        var date = new Date(parseInt(row.Ptime));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        return Y+M;
    },
    deleteRow:function(paperid){
        var that = this;
                var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "删除Paper table",
        async function(){

        await axios.post(
            config.server_host + "/api/paper/rm_paper_table",
            {"paperid":paperid,"tableid":that.id}
        );
                that.reload();
        });
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">

</style>
