var { client } = require("./init");
const md5 = require("../utils/md5")

function insert_meetings(meetings){
    return new Promise((resolve,reject)=>{
        client.sadd("RSB_Paper_Meetings",meetings,(err)=>{
            if(err)console.log(err);
            resolve(true);
        })
    })
}

function del_meetings(meetings){
    return new Promise((resolve,reject)=>{
        client.srem("RSB_Paper_Meetings",meetings,(err)=>{
            if(err)console.log(err);
            resolve(true);
        })
    })
}

function get_meetings(){
    return new Promise((resolve,reject)=>{
        client.smembers("RSB_Paper_Meetings",(err,value)=>{
            if(err)console.log(err);
            resolve(value);
        })
    })
}

function get_papers_by_meetings(meetings){
    var keys = [];
    for(var i =0;i<meetings.length;i++)keys[i]="RSB_Papers_By_Meeting_"+meetings[i].replace(" ","+")
    return new Promise((resolve,reject)=>{
        client.sunion(keys,(err,value)=>{
            if(err)console.log(err);
            resolve(value);
        })
    })
}

function is_meeting(meeting){
    return new Promise((resolve,reject)=>{
        client.sismember("RSB_Paper_Meetings",meeting,(err,value)=>{
            if(err)console.log(err);
            resolve(value)
        })
    })
}

function del_paper_from_meeting(paper, meeting){
    if(meeting == "")return Promise.all([]);
    return Promise.all([
        new Promise((resolve,reject)=>{
            client.srem("RSB_Papers_By_Meeting_"+meeting,paper,(err)=>{
                if(err)console.log(err);
                resolve(true);
            })
        }),
        new Promise((resolve,reject)=>{
            client.scard("RSB_Papers_By_Meeting_"+meeting,(err,value)=>{
                if(err)console.log(err);
                resolve(value)
            })
        }).then(
            num_left=>{
                if(num_left==0){
                    return del_meetings(meeting);
                }else return Promise.resolve(true);
            }
        )
    ])
}

function put_paper_to_meeting(paper, meeting){
    return is_meeting(meeting).then(
        ismeeting=>{
            if(!ismeeting){
                insert_meetings(meeting).then(
                    status=>{
                        if(status){
                            return new Promise((resolve,reject)=>{
                                client.sadd("RSB_Papers_By_Meeting_"+meeting,paper,(err)=>{
                                    if(err)console.log(err);
                                    resolve(true)
                                })
                            })
                        }
                    })
            }
            return new Promise((resolve,reject)=>{
                client.sadd("RSB_Papers_By_Meeting_"+meeting,paper,(err)=>{
                    if(err)console.log(err);
                    resolve(true)
                })
            })

        }
    )
}

module.exports={
    insert_meetings,
    del_meetings,
    get_meetings,
    get_papers_by_meetings,
    is_meeting,
    put_paper_to_meeting,
    del_paper_from_meeting
}
