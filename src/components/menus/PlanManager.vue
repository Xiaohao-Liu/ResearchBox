<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;padding:0px;">

    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-document" style="width: 100%;" v-on:click="show_add_table==true?show_add_table=false:show_add_table=true;">添加Table</el-button>
        <el-card class="add_board" v-show="show_add_table">
            <el-form label-position="top" label-width="80px" :model="add_form">
                <el-form-item label="标题">
                    <el-input v-model="add_form.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="add_table">立即添加</el-button>
                    <el-button v-on:click="show_add_table=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
    <el-divider><i class="el-icon-arrow-down"></i></el-divider>
    <el-row v-for="table in now_tables" :key="table.Ntime">
        <el-tag class="left_table" v-on:click="$router.push('/planeditor/'+table.Ntime)"  closable @close="delTable(table.Ntime)">{{table.title}}</el-tag>
    </el-row>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");

export default {
    inject:['reload'],
  name: 'planmanager',
  data(){
    return {
        now_tables:[],
        now_tables_title:[],
        edit_index:0,
        add_form:{
            title:""
        },
        show_add_table:false
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
                url: config.server_host + "/api/plan/by_ntime",
                async:false,
                dataType:"json",
                success:function(returndata){
                    console.log(returndata)
                    for(var ntime in returndata.data){
                        that.now_tables.push({"Ntime":ntime,"title":returndata.data[ntime]})
                        that.now_tables_title.push(returndata.data[ntime]);
                    }
                }
            });
        }
    );
    first_loadding.start();
  },
  methods:{
      add_table:function(){
          var that = this;
          console.log(that.add_form);
          var loadding = new Loadding();
            loadding.add_title("初始化");
            loadding.__init__();
            loadding.add_process(
                "添加table",
                function(){
                    $.ajax({
                        type:"POST",
                        url: config.server_host + "/api/plan/add",
                        async:false,
                        data:{"title":that.add_form.title},
                        dataType:"json",
                        success:function(returndata){
                            that.show_add_table=false;
                            console.log(returndata);
                            that.reload();
                        }
                });
            })
        loadding.start();
      },
      delTable:function(ntime){
        var that = this;
          var loadding = new Loadding();
        loadding.add_title("初始化");
        loadding.__init__();
        loadding.add_process(
        "删除table",
        function(){
          $.ajax({
            type:"POST",
            url: config.server_host + "/api/plan/del",
            async:false,
            data:{"ntime":ntime},
            dataType:"json",
            success:function(returndata){
                console.log(returndata);
                that.reload();
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
.left_table{
    width: calc(100% - 20px);
    text-align: center;
    margin: 10px;
    cursor: pointer;
}
</style>
