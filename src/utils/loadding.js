const $ = require("jquery");

function Loadding(title){
    this.title = title;
    this.process=[];
    
    this.cover=null;
    this.dom=null;
    this.tle=null;
    this.bar=null;
    this.infos=null;

    // this.__init__();
    /*
    <div class="Loadding_cover">
        <div class="Loadding_board">
            <div class="Loadding_title">Title</div>
            <div class="Loadding_bar"></div>
            <div class="Loadding_info">info......10%</div>
        </div>
    </div>
    */
}
Loadding.prototype={
    __init__:function(){
        this.cover=$("<div class='Loadding_cover' style='opacity:0;'></div>");
        this.dom=$("<div class='Loadding_board'></div>");
        this.tle=$("<div class='Loadding_title'>"+this.title+"</div>");
        this.bar=$("<div class='Loadding_bar'></div>");
        this.infos=$("<div class='Loadding_info'>"+this.title+"......0%</div>");
        this.dom.append(this.tle);
        this.dom.append(this.bar);
        this.dom.append(this.infos);
        this.cover.append(this.dom);
    },
    add_title:function(title){
        this.title=title;
    },
    add_process:function(name,todo){
        this.process[this.process.length] = {"name":name, "todo":todo};
    },
    start:function(success_todo=null,failed_todo=null){
        var l = this.process.length;
        var that = this;
        $(document.body).append(that.cover);
        that.cover.css("opacity",1);
        var loop_id=setTimeout(()=>{
            loop_(0);
        },0);
        function loop_(i){
            if(i<l){
                try{
                    var length=parseInt((i/l)*100);
                    that.bar[0].offsetLeft;
                    that.bar.css("width","calc("+length+"% - 20px)");
                    that.infos.text(that.process[i].name + "......"+length+"%");
                    // alert();
                    
                    loop_id=setTimeout(()=>{
                        that.process[i].todo().then(()=>{

                            loop_(i+1);
                        })
                    },0);
                }
                catch{
                    that.tle.text(that.title + ":" + that.process[i].name + "失败！请重新尝试。")
                    that.bar.css("background","red");
                    if(failed_todo!=null)failed_todo();
                    clearTimeout(loop_id);
                    return;
                }
                
            }else{
                that.bar.css("width","calc(100% - 20px)");
                that.infos.text("完成......100%");
                that.cover.css("opacity",0);
                setTimeout(function(){
                    that.cover.remove();
                },500);
                if(success_todo!=null)success_todo();
                clearTimeout(loop_id);
            }
            
        }


    }
}

module.exports=Loadding;