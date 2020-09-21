<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
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
      <el-table
        :data="paper_list"
        style="width: 100%"
        :default-sort = "{prop: 'Ntime', order: 'descending'}"
        >
        <el-table-column
        prop="Ntime"
        label="新建日期"
        sortable
        width="180"
        :formatter="Ntime_formate">
        </el-table-column>
        <el-table-column
        prop="Ptime"
        label="发布日期"
        sortable
        width="180"
        :formatter="Ptime_formate">
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题"
        >
        <template slot-scope="scope">
            <strong>{{scope.row.title}}</strong>
            <!-- <span style="background:red;">{{ scope.row.process }}</span> -->
        </template>
        </el-table-column>
        <el-table-column
        prop="process"
        label="进度"
        sortable
        width="180"
        >
        <template slot-scope="scope">
            <el-progress width=40 stroke-width=3 type="dashboard" :percentage="scope.row.process"></el-progress>
            <!-- <span style="background:red;">{{ scope.row.process }}</span> -->
        </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
            <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
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
const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");

export default {
  name: 'plan',
  props: 
    ['ntime'],
  
  data(){
    return {
        show_add_paper:false,
        not_inited:false,
        editForm:{
            Ntime:"",
            title:"",
            process:0,
            list:[]
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
        function(){
            $.ajax({
            type:"GET",
            url: config.server_host + "/api/plan/fetchone/"+that.ntime,
            async:false,
            dataType:"json",
            success:function(returndata){
                
                var data = returndata.data[0];
                that.editForm["Ntime"] = data["Ntime"];
                that.editForm["title"] = data["title"];
                that.editForm["process"] = parseInt(data["process"]);
                that.editForm["list"] = data["list"]==""?[]:data["list"].split(";");
                console.log(that.editForm)
            }
        });
        })
        first_loadding.add_process(
        "获取Paper数据",
        function(){
            if(that.editForm["list"].length == 0)return;
        $.ajax({
            type:"POST",
            url: config.server_host + "/api/plan/paper_by_table",
            async:false,
            data:{md5_titles:that.editForm["list"]},
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
        });
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">



</style>
