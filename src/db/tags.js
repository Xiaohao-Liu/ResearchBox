var { client } = require("./init");
const md5 = require("../utils/md5");

function insert_tags(tags){
    
    return new Promise((resolve,reject)=>{
        client.sadd("RSB_Paper_Tags",tags,(err)=>{
            if(err)console.log(err);
            resolve(true);
        })
    })
}

function del_tags(tags){
    return new Promise((resolve,reject)=>{
        client.srem("RSB_Paper_Tags",tags,(err)=>{
            if(err)console.log(err);
            resolve(true);
        })
    })
}

function get_tags(){
    return new Promise((resolve,reject)=>{
        client.smembers("RSB_Paper_Tags",(err,value)=>{
            if(err)console.log(err);
            resolve(value);
        })
    })
}

function get_papers_by_tags(tags){
    var keys = [];
    for(var i =0;i<tags.length;i++)keys[i]="RSB_Papers_By_Tag_"+tags[i].replace(" ","+")
    return new Promise((resolve,reject)=>{
        client.sunion(keys,(err,value)=>{
            if(err)console.log(err);
            resolve(value);
        })
    })
}

function is_tag(tag){
    return new Promise((resolve,reject)=>{
        client.sismember("RSB_Paper_Tags",tag,(err,value)=>{
            if(err)console.log(err);
            resolve(value)
        })
    });
}

function del_paper_from_tag(paper, tag){
    if(tag == "")return Promise.all([]);
    return Promise.all([
        new Promise((resolve,reject)=>{
            client.srem("RSB_Papers_By_Tag_"+tag,paper,(err)=>{
                if(err)console.log(err);
                resolve(true)
            })
        }),
        new Promise((resolve,reject)=>{
            client.scard("RSB_Papers_By_Tag_"+tag,(err,value)=>{
                if(err)console.log(err);
                resolve(value);
            })
        }).then(
            num_left=>{
                if(num_left==0){
                    return del_tags(tag);
                }else return Promise.resolve(true);
            }
        )
    ])
    
}

function put_paper_to_tag(paper, tag){
    return is_tag(tag).then(
        istag=>{
            if(!istag){
                insert_tags(tag).then(
                    status=>{
                        if(status){
                            return new Promise((resolve,reject)=>{
                                client.sadd("RSB_Papers_By_Tag_"+tag,paper,(err)=>{
                                    if(err)console.log(err);
                                    resolve(true)
                                })
                            })
                        }
                    })
            }
            return new Promise((resolve,reject)=>{
                client.sadd("RSB_Papers_By_Tag_"+tag,paper,(err)=>{
                    if(err)console.log(err);
                    resolve(true)
                })
            })
        }
    )
}

module.exports={
    insert_tags,
    del_tags,
    is_tag,
    get_tags,
    get_papers_by_tags,
    put_paper_to_tag,
    del_paper_from_tag
}
