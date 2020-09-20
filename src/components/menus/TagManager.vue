<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
      <el-card class="tag_list">
          <el-row>
            <el-col >
                <el-tag v-for="tag in tags_list" :key="tag" v-show="tag!=''" v-on:click="handlePush(tag)" size="mini">{{tag}}</el-tag>
            </el-col>
        </el-row>
      </el-card>
      <el-card class="tag_search">
          <el-row>
            <el-col >
                <el-tag v-for="tag in search_tags" :key="tag" v-show="tag!=''" closable @close="handleClose(tag)">{{tag}}</el-tag>
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
export default {
    inject:['reload'],
  name: 'login',
  props: {
    msg: String
  },
  data(){
    return {
        tags_list:[],
        search_tags:[],
        paper_list:[],
    }
  },
  mounted:function(){
      var that =this;
      $.ajax({
            type:"GET",
            url: config.server_host + "/api/tag/get",
            async:false,
            dataType:"json",
            success:function(returndata){
                that.tags_list = returndata.data;
            }
        });
  },
  methods:{
    handleClose(tag) {
        this.search_tags.splice(this.search_tags.indexOf(tag), 1);
        this.get_papers_by_search_tags()
    },
    handlePush(tag) {
        if(this.search_tags.indexOf(tag)>=0)return;
        this.search_tags.push(tag);
        this.get_papers_by_search_tags()
    },

    get_papers_by_search_tags:function(){
        var that = this;
        if(that.search_tags.length==0){return;}
        $.ajax({
            type:"POST",
            url: config.server_host + "/api/tag/paper_by_tags",
            async:false,
            data:{tags:that.search_tags},
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
.tag_list{

}
.tag_list .el-tag{
    cursor: pointer;
}
.tag_search{
    box-shadow: 0px 0px 0 0 black !important;
    background: transparent !important;
    border: 0px !important;
}
</style>
