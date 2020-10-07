<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-s-order"></i>计划管理 </el-col>
        </el-row>
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-document" style="width: auto;" v-on:click="show_add_table==true?show_add_table=false:show_add_table=true;">添加Table</el-button>
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
    <el-badge  class="nums" v-for="table in now_tables" :key="table.id" :value="table.nums" type="primary">
        <el-tag  class="left_table" v-on:click="$router.push('/planeditor/'+table.id)"  closable @close="delTable(table.id)">{{table.title}}</el-tag>
    </el-badge>
  </el-main>
</template>

<script>
// const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");
const axios = require('axios');

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
            //  $.ajax({
            //     type:"GET",
            //     url: config.server_host + "/api/plan/by_ntime",
            //     async:false,
            //     dataType:"json",
            //     success:function(returndata){
            //         console.log(returndata)
            //         for(var i in returndata.data.data){
            //             that.now_tables.push({"id":returndata.data.data[i].id,"title":returndata.data.data[i].title,"nums":returndata.data.data[i].nums})
            //             that.now_tables_title.push(returndata.data.data[i].title);
            //         }
            //     }
            // });
            axios.get(
                config.server_host + "/api/plan/by_ntime"
            ).then(
                returndata=>{
                    console.log(returndata)
                    for(var i in returndata.data.data){
                        that.now_tables.push({"id":returndata.data.data[i].id,"title":returndata.data.data[i].title,"nums":returndata.data.data[i].nums})
                        that.now_tables_title.push(returndata.data.data[i].title);
                    }
                }
            );

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
                //     $.ajax({
                //         type:"POST",
                //         url: config.server_host + "/api/plan/add",
                //         async:false,
                //         data:{"title":that.add_form.title},
                //         dataType:"json",
                //         success:function(returndata){
                //             that.show_add_table=false;
                //             console.log(returndata);
                //             that.reload();
                //         }
                // });
                axios.post(
                    config.server_host + "/api/plan/add",
                    {"title":that.add_form.title}
                ).then(
                    returndata=>{
                        that.show_add_table=false;
                        console.log(returndata);
                        that.reload();
                    }
                )
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
        //   $.ajax({
        //     type:"POST",
        //     url: config.server_host + "/api/plan/del",
        //     async:false,
        //     data:{"ntime":ntime},
        //     dataType:"json",
        //     success:function(returndata){
        //         console.log(returndata);
        //         that.reload();
        //     }
        // });
        axios.post(
            config.server_host + "/api/plan/del",
            {"ntime":ntime}
        ).then(
            returndata=>{
                console.log(returndata);
                that.reload();
            }
        );
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
    min-width: 150px;
    text-align: center;
    margin: 10px;
    cursor: pointer;
    font-size: 16px !important;
    float: left;
    position: relative;
    // max-width: 50%;
    padding-right:40px !important;
}
.left_table .el-tag__close.el-icon-close{
        position: absolute;
    top: 5px;
    right: 5px;
    background: white;
    font-size: 15px;
    padding: 2px;
    height: 16px;
    box-shadow: -2px 1px 6px rgba(0,0,0,.1);
    width: 16px;
}
.left_table .el-tag__close.el-icon-close:hover{
    background: $--color-primary;
    color:white;
}
.nums .el-badge__content{
    margin:10px;
}
</style>
