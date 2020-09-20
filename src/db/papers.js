var { client } = require("./init");
var  {put_paper_to_meeting,del_paper_from_meeting} = require("./meeting");
var  {put_paper_to_tag,del_paper_from_tag} = require("./tags");

const md5 = require("../utils/md5");

function insertPaper(paper,replace=false){
    var time = new Date().getTime();
    var RSB_Paper = {
        title:paper.title,
        author1:paper.author1,
        author2:"",
        cite:"",
        meeting:"",
        tags:"",
        process:'0',
        link:"",
        references:"",
        md5_title:md5(paper.title),
        Ptime:paper.Ptime,
        Ntime:time
    };
    if(replace){
        RSB_Paper = {
            title:paper.title,
            author1:paper.author1,
            author2:paper.author2,
            cite:paper.cite,
            meeting:paper.meeting,
            tags:paper.tags,
            process:paper.process,
            link:paper.link,
            md5_title:md5(paper.title),
            Ptime:paper.Ptime,
            Ntime:paper.Ntime
        };
    }
    return new Promise((resolve,reject)=>{
        client.hmset("RSB_Paper_"+RSB_Paper.md5_title,RSB_Paper,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    }).then(
        res=>{
            return Promise.all([
                new Promise((resolve,reject)=>{
                    client.zadd("RSB_Papers_By_Ntime",RSB_Paper.Ntime,RSB_Paper.md5_title,(err)=>{
                        if(err) console.log(err);
                        resolve(true);
                    })
                }),
                new Promise((resolve,reject)=>{
                    client.zadd("RSB_Papers_By_Ptime",RSB_Paper.Ptime,RSB_Paper.md5_title,(err)=>{
                        if(err) console.log(err);
                        resolve(true);
                    })
                })
            ])
        }
    )
}

function getPaperByNtime(){
    return new Promise((resolve,reject)=>{
        client.zrange("RSB_Papers_By_Ntime",0,(new Date().getTime()), (err,value)=>{
            if(err) {
                console.log(err);
                return; 
            }
            resolve(value)
        })
    })
}

function getPapersInfo(md5titles){
    var promise_stack=[];
    for(let i = 0;i < md5titles.length;i++){
        promise_stack[i] = new Promise((resolve,reject)=>{
            client.hgetall("RSB_Paper_"+md5titles[i],(err,value)=>{
                if(err) console.log(err);  
                resolve(value);

            })
        })
    }
    return Promise.all(promise_stack)
}

function deletePaper(md5_title){
    return Promise.all([
        new Promise((resolve,reject)=>{
            client.hget("RSB_Paper_"+md5_title,"tags",(err,value)=>{
                if(err) console.log(err);
                resolve(value.split(';'));
            })
        }).then(
            old_tags=>{
                var stack = []
                for(let i = 0;i<old_tags.length;i++){
                    stack[i] = del_paper_from_tag(md5_title,old_tags[i].replace(" ","+"));
                }
                return Promise.all(stack);
            }
        ),
        new Promise((resolve,reject)=>{
            client.hget("RSB_Paper_"+md5_title,"meeting",(err,value)=>{
                if(err) console.log(err);
                resolve(value)
            })
        }).then(
            old_meeting=>{
                return del_paper_from_meeting(md5_title,old_meeting)
            }
        ),
        new Promise((resolve,reject)=>{
            client.del("RSB_Paper_"+md5_title,(err)=>{
                if(err) console.log(err);
                resolve(true);
            })
        }),
        new Promise((resolve,reject)=>{
            client.zrem("RSB_Papers_By_Ntime",md5_title,(err)=>{
                if(err) console.log(err);
                resolve(true);
            })
        }),
        new Promise((resolve,reject)=>{
            client.zrem("RSB_Papers_By_Ptime",md5_title,(err)=>{
                if(err) console.log(err);
                resolve(true);
            })
        }),
    ])
}


function set_paper_author1(md5_title,new_author1){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Paper_"+md5_title,"author1",new_author1,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
}
function set_paper_author2(md5_title,new_author2){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Paper_"+md5_title,"author2",new_author2,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
    
}
function set_paper_cite(md5_title,new_cite){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Paper_"+md5_title,"cite",new_cite,(err)=>{
            if(err) console.log(err);
            resolve(true);
        })
    })
}
function set_paper_meeting(md5_title,new_meeting){
    
    return new Promise((resolve,reject)=>{
        client.hget("RSB_Paper_"+md5_title,"meeting",(err,value)=>{
            if(err) console.log(err);
            resolve(value)
        })
    }).then(
        old_meeting=>{
            return Promise.all([
                del_paper_from_meeting(md5_title,old_meeting),
                put_paper_to_meeting(md5_title,new_meeting)
            ]).then(_=>{
                client.hset("RSB_Paper_"+md5_title,"meeting",new_meeting,(err)=>{
                    if(err) console.log(err);
                    return Promise.resolve(true)
                })
            })
        }
    )
}

function set_paper_tags(md5_title,new_tags){
    return new Promise((resolve,reject)=>{
        client.hget("RSB_Paper_"+md5_title,"tags",(err,value)=>{
            if(err) console.log(err);
            resolve(value.split(';'));
        })
    }).then(
        old_tags=>{
            var stack = []
            for(let i = 0;i<old_tags.length;i++){
                stack[i] = del_paper_from_tag(md5_title,old_tags[i].replace(" ","+"));
            }
            for(let i = 0;i<new_tags.length;i++){
                stack[i+old_tags.length] = put_paper_to_tag(md5_title,new_tags[i].replace(" ","+"));
            }
            return Promise.all(stack).then(_=>{
                client.hset("RSB_Paper_"+md5_title,"tags",new_tags.join(";"),(err)=>{
                    if(err) console.log(err);
                    return Promise.resolve(true)
                })
            })
        }
    )
    
    
}

function set_paper_process(md5_title,new_process){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Paper_"+md5_title,"process",new_process,(err)=>{
            if(err) console.log(err);
            resolve(true)
        })
    })
}
function set_paper_link(md5_title,new_link){
    return new Promise((resolve,reject)=>{
        client.hset("RSB_Paper_"+md5_title,"link",new_link,(err)=>{
            if(err) console.log(err);
            resolve(true)
        })
    })
}
function set_paper_ptime(md5_title,new_ptime){
    return Promise.all([
        new Promise((resolve,reject)=>{
            client.zrem("RSB_Papers_By_Ptime",md5_title,(err)=>{
                if(err) console.log(err);
                resolve(true)
            })
        }),
        new Promise((resolve,reject)=>{
            client.zadd("RSB_Papers_By_Ptime",new_ptime,md5_title,(err)=>{
                if(err) console.log(err);
                resolve(true)
            })
        }),
        new Promise((resolve,reject)=>{
            client.hset("RSB_Paper_"+md5_title,"Ptime",new_ptime,(err)=>{
                if(err) console.log(err);
                resolve(true)
            })
        })
    ])
}


function set_paper_all(md5_title,new_paper){
    if(md5_title != md5(new_paper.title)){
        return Promise.all([
            deletePaper(md5_title),
            insertPaper(new_paper,replace=true)
        ])
    }
    return Promise.all([
        set_paper_author1(md5_title,new_paper.author1),
        set_paper_author2(md5_title,new_paper.author2),
        set_paper_cite(md5_title,new_paper.cite),
        set_paper_link(md5_title,new_paper.link),
        set_paper_meeting(md5_title,new_paper.meeting),
        set_paper_process(md5_title,new_paper.process),
        set_paper_ptime(md5_title,new_paper.Ptime),
        set_paper_tags(md5_title,new_paper.tags.split(";"))
    ])
}

module.exports={
    insertPaper,
    getPaperByNtime,
    getPapersInfo,
    deletePaper,
    // set_paper_title,
    set_paper_author1,
    set_paper_author2,
    set_paper_cite,
    set_paper_link,
    set_paper_meeting,
    set_paper_process,
    set_paper_ptime,
    set_paper_tags,
    set_paper_all
}