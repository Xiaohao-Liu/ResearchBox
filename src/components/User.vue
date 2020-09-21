<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">

  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../utils/config");
const Loadding = require("../utils/loadding");

export default {
    inject:['reload'],
  name: 'User',
  props: {
    msg: String
  },
  data(){
    return {
        select_tag:"",
        tags_list:[],
        search_tags:[],
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
            url: config.server_host + "/api/tag/get",
            async:false,
            dataType:"json",
            success:function(returndata){
                that.tags_list = returndata.data;
            }
        });
        })
        first_loadding.start();
  },
  methods:{
    handleClose(tag) {
        this.search_tags.splice(this.search_tags.indexOf(tag), 1);
        this.get_papers_by_search_tags()
    },
    handlePush(tag) {
        if(this.search_tags.indexOf(tag)>=0)return;
        this.search_tags.push(tag);
        this.get_papers_by_search_tags();
    },

    get_papers_by_search_tags:function(){
        var that = this;
        if(that.search_tags.length==0){return;}
        var loadding = new Loadding();
    loadding.add_title("初始化");
    loadding.__init__();
    loadding.add_process(
        "获取Paper数据",
        function(){
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
        });
        loadding.start();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../assets/theme";

</style>
