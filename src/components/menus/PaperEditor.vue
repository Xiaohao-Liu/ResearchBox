<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-row class="ops" style="margin:10px;">
        <el-button type="primary" icon="el-icon-back" v-on:click="$router.push('/papermanager')" circle></el-button>
        <el-button type="primary" icon="el-icon-finished" v-on:click="upload_all()" circle></el-button>
    </el-row>
    <el-card  class="paper_info">
        <el-row>
            <el-col :span="24" class="paper_ntime" > {{new Date(parseInt(edit_form.Ntime)).getMonth() + 1}},{{new Date(parseInt(edit_form.Ntime)).getFullYear()}} </el-col>
        </el-row>
        <div class="status_bar" v-bind:style="{width:edit_form.process + '%'}"></div>
        <el-row>
            <el-col :span="24" class="paper_title"> {{edit_form.title}} </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="paper_meeting" > {{edit_form.meeting!=''?edit_form.meeting:''}} {{new Date(parseInt(edit_form.Ptime)).getMonth() + 1}},{{new Date(parseInt(edit_form.Ptime)).getFullYear()}} </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="paper_author"> {{edit_form.author1}} {{edit_form.author2==""?'':','}} {{edit_form.author2}} </el-col>
        </el-row>
        <el-row>    
            <el-col :span="24" class="paper_cite"><span>cited:</span>{{edit_form.cite}}</el-col>
        </el-row>
        <el-row>    
            <el-col :span="24" class="paper_tags">
                <el-tag
                    :key="tag"
                    v-for="tag in edit_form.tags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" style="margin-left: 20px;" @click="showInput">+ New Tag</el-button>
            </el-col>
        </el-row>
    </el-card>
    <el-card  class="paper_edit">
        <el-form ref="form" :model="edit_form" label-position="top" label-width="80px">
            <el-form-item label="阅读进度">
                <el-slider v-model="edit_form.process" :step="10" show-stops></el-slider>
            </el-form-item>
            <el-form-item label="标题">
                <el-input placeholder="请输入内容" v-model="edit_form.title" clearable class="paper_edit_title"> </el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-row :gutter="20">
                    <el-col :span="12" > <el-input placeholder="请输入内容" v-model="edit_form.author1" clearable class="paper_edit_author"> </el-input> </el-col>
                    <el-col :span="12" > <el-input placeholder="请输入内容" v-model="edit_form.author2" clearable class="paper_edit_author"> </el-input> </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发表会议/期刊">
                <el-input placeholder="请输入内容" v-model="edit_form.meeting" clearable class="paper_edit_meeting"> </el-input>
            </el-form-item>
            <el-form-item label="发表时间">
                <el-row>
                    <el-col :span="12" class="block">
                        <el-date-picker v-model="edit_form.Ptime" type="year" value-format="timestamp" placeholder="选择年">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="12" class="block">
                        <el-date-picker v-model="edit_form.Ptime" type="month" value-format="timestamp" placeholder="选择月">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="引用量">
                <el-input placeholder="请输入内容" v-model="edit_form.cite" clearable class="paper_edit_cite"> </el-input>
            </el-form-item>
        </el-form>

    </el-card>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../../utils/config");
const Loadding = require("../../utils/loadding");

export default {
  name: 'login',
  props: 
    ['md5_title'],
  
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
        edit_form:{
            title:"",
            author1:"",
            author2:"",
            cite:"",
            meeting:"",
            tags:[],
            process:"",
            link:"",
            Ptime:"",
            Ntime:""
        },
        inputVisible:false,
        inputValue:"",
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
      var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process(
        "拉取数据",
        function(){
      $.ajax({
            type:"GET",
            url: config.server_host + "/api/paper/fetchone/"+that.md5_title,
            async:false,
            dataType:"json",
            success:function(returndata){
                var data = returndata.data[0];
                var s = ['title','author1','author2','cite','Ptime','Ntime','meeting','link',]
                that.source_title = data["title"]
                for(var i =0;i<s.length;i++)that.edit_form[s[i]] = data[s[i]];
                if(data['tags'] != ''){
                    that.edit_form['tags'] = data['tags'].split(';');
                    console.log(data['tags'])
                }else that.edit_form['tags']=[]
                that.edit_form['process'] = parseInt(data['process']);
                console.log(that.edit_form)
            }
        });
        })
        first_loadding.start()
  },
  methods:{
      upload_all:function(){
        var that =this;
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "更新数据",
        function(){
        var form = {}
        for(var key in that.edit_form)form[key] = that.edit_form[key]
        form["tags"] = form["tags"].join(";")
        $.ajax({
            type:"POST",
            url: config.server_host + "/api/paper/uploadone",
            async:false,
            data:{"md5_title":that.md5_title,"new_paper":form},
            dataType:"json",
            success:function(returndata){
                that.$router.push('/papereditor/'+returndata.data.md5_title)
            }
        });
        })
        loadding.start();
      },
      handleClose:function(tag) {
        this.edit_form.tags.splice(this.edit_form.tags.indexOf(tag), 1);
      },

      showInput:function() {
        this.inputVisible = true;
        this.$nextTick(_ => {
            console.log(_)
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm:function() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.edit_form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.paper_info{
    position: relative;
}
.ops .el-button i{
    font-weight: bold;
}
.paper_title{
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 6px #ddd;
}
.paper_author{
    margin-top: 10px;
    text-align: center;
}
.paper_meeting{
    text-align: center;
    margin-top: 10px;
}
.paper_cite{
    text-align: right;
    font-size: 12px;
    margin: 10px 0px;
}
.paper_cite span{
    color:#999;
}

.paper_edit{
    margin-top: 10px;
}
.paper_edit .el-form-item__label{
    line-height: 20px;
}
.status_bar{
        position: absolute;
    bottom: 0px;
    left: 0px;
    height: 5px;
    background: #009688;
    transition: ease .5s;
    border-radius: 10px;
}


.el-tag + .el-tag {
margin-left: 10px;
}
.button-new-tag {
margin-left: 10px;
height: 32px;
line-height: 30px;
padding-top: 0;
padding-bottom: 0;
}
.input-new-tag {
width: 150px !important;
margin-left: 10px;
vertical-align: bottom;
}
</style>
