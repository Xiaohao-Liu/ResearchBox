<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-document-add" v-on:click="show_add_paper==true?show_add_paper=false:show_add_paper=true;">添加Paper</el-button>
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
    </el-row>
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
            <el-col :span="12" style="text-align:right;">
                <el-dropdown @command="handleCommand">
                    <el-button type="primary" icon="el-icon-menu" class="paper_dropdown_btn" circle>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-bind:command="{'type':'d','params':paper.md5_title}" >删除</el-dropdown-item>
                        <el-dropdown-item v-bind:command="{'type':'e','params':paper.md5_title}" >编辑</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
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
export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
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
        add_form:{
            title:"",
            author1:"",
            Ptime:"",
            PtimeYear:"",
            PtimeMon:""
        },
        paper_list:[],
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
      $.ajax({
            type:"GET",
            url: config.server_host + "/api/paper/by_ntime",
            async:false,
            dataType:"json",
            success:function(returndata){
                console.log(returndata)
                for(var i = 0; i< returndata.data.length;i++){
                    if(returndata.data[i] ==null)continue;
                    if(returndata.data[i]['tags'] != ''){
                        returndata.data[i]['tags'] = returndata.data[i]['tags'].split(';');
                    }else returndata.data[i]['tags']=[]
                    that.paper_list.push(returndata.data[i]);
                }
            }
        });
  },
  methods:{
      add_paper:function(){
          var that = this;
          console.log(that.add_form);
          $.ajax({
            type:"POST",
            url: config.server_host + "/api/paper/add",
            async:false,
            data:{"title":that.add_form.title,"author1":that.add_form.author1,"Ptime":that.add_form.Ptime},
            dataType:"json",
            success:function(returndata){
                that.show_add_paper=false;
                console.log(returndata);
                that.reload();
            }
        });
      },
      del_paper:function(md5_title){
          var that = this;
          $.ajax({
            type:"POST",
            url: config.server_host + "/api/paper/del",
            async:false,
            data:{"md5_title":md5_title},
            dataType:"json",
            success:function(returndata){
                console.log(returndata);
                that.reload();
            }
        });
      },
      handleCommand:function(command){
          if(command.type=='e'){
              this.$router.push('/papereditor/'+command.params);
          }
          if(command.type=='d'){
              this.del_paper(command.params)
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.add_board{
    position:absolute;
    width: 60%;
    margin-top:10px;
    z-index: 100;
}
.add_board .el-form-item__label{
    line-height: 20px;
}
.paper{
        max-width: 250px;
        margin:5px;
        float:left;
        position: relative;
}
.paper .el-card__header{
    font-weight: bold;
    font-size: 1em;
        position: relative;
    z-index: 10;
    padding-top: 1.5em;
}
.paper .ptime{
    font-size:12px;
}
.paper .meeting{
        position: absolute;
    z-index: 0;
    color: #ddd;
    top: 0px;
    left: 20px;
    font-size: 1em;
    line-height: 1.6em;
    font-weight: bold;
}
.micro_tag{
    font-size: 8px !important;
    border-radius: 10px !important;
    padding: 0px 10px !important;
    height: 20px !important;
    line-height: 20px !important;
    background:$--color-primary !important;
    color:white !important;
}
</style>
