// var { client } = require("./init");
// const md5 = require("../utils/md5");

// function insert_tags(tags){
    
//     return new Promise((resolve,reject)=>{
//         client.sadd("RSB_Paper_Tags",tags.toLowerCase(),(err)=>{
//             if(err)console.log(err);
//             resolve(true);
//         })
//     })
// }

// function del_tags(tags){
//     return new Promise((resolve,reject)=>{
//         client.srem("RSB_Paper_Tags",tags.toLowerCase(),(err)=>{
//             if(err)console.log(err);
//             resolve(true);
//         })
//     })
// }

// function get_tags(){
//     return new Promise((resolve,reject)=>{
//         client.smembers("RSB_Paper_Tags",(err,value)=>{
//             if(err)console.log(err);
//             resolve(value);
//         })
//     })
// }

// function get_papers_by_tags(tags){
//     var keys = [];
//     for(var i =0;i<tags.length;i++)keys[i]="RSB_Papers_By_Tag_"+tags[i].replace(" ","+").toLowerCase()
//     return new Promise((resolve,reject)=>{
//         client.sunion(keys,(err,value)=>{
//             if(err)console.log(err);
//             resolve(value);
//         })
//     })
// }

// function is_tag(tag){
//     return new Promise((resolve,reject)=>{
//         client.sismember("RSB_Paper_Tags",tag.toLowerCase(),(err,value)=>{
//             if(err)console.log(err);
//             resolve(value)
//         })
//     });
// }

// function del_paper_from_tag(paper, tag){
//     if(tag == "")return Promise.all([]);
//     return Promise.all([
//         new Promise((resolve,reject)=>{
//             client.srem("RSB_Papers_By_Tag_"+tag.toLowerCase(),paper,(err)=>{
//                 if(err)console.log(err);
//                 resolve(true)
//             })
//         }),
//         new Promise((resolve,reject)=>{
//             client.scard("RSB_Papers_By_Tag_"+tag.toLowerCase(),(err,value)=>{
//                 if(err)console.log(err);
//                 resolve(value);
//             })
//         }).then(
//             num_left=>{
//                 if(num_left==0){
//                     return del_tags(tag.toLowerCase());
//                 }else return Promise.resolve(true);
//             }
//         )
//     ])
    
// }

// function put_paper_to_tag(paper, tag){
//     return is_tag(tag).then(
//         istag=>{
//             if(!istag){
//                 insert_tags(tag).then(
//                     status=>{
//                         if(status){
//                             return new Promise((resolve,reject)=>{
//                                 client.sadd("RSB_Papers_By_Tag_"+tag.toLowerCase(),paper,(err)=>{
//                                     if(err)console.log(err);
//                                     resolve(true)
//                                 })
//                             })
//                         }
//                     })
//             }
//             return new Promise((resolve,reject)=>{
//                 client.sadd("RSB_Papers_By_Tag_"+tag.toLowerCase(),paper,(err)=>{
//                     if(err)console.log(err);
//                     resolve(true)
//                 })
//             })
//         }
//     )
// }

const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require("./init");

const Tag = sequelize.define('Tag', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // allowNull defaults to true
  },
  nums:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  papers:{
    type: DataTypes.TEXT
  },
  Ntime:{
    type:DataTypes.DATE,
}
}, {
    timestamps: true,
    createdAt:"Ntime",
  // Other model options go here
});
await Tag.sync();

function get_tags(){
    var tags = await Tag.findAll();
    return tags.toJSON();
}

function get_papers_by_tags(ids){
    var tags = await Tag.findAll({
        attributes:['papers'],
        where:{
            id:{
                [Op.or]:ids
            }
        }
    });
    var paper_ids = []
    tags.every(tag=>{
        paper_ids = paper_ids.concat(tag.papers.split(';'))
    })
    return paper_ids;
}

function tag_id(tagtitle){
    var tag = await Tag.findOne(
        {
            attributes:['id'],
            where:{
                title:tagtitle
            }
        }
    )
    return tag != null?tag.id:-1;
}

function del_paper_from_tag(paperid,tagtitle){
    var tagid = tag_id(tagtitle);
    if(tagid == -1)return null;
    var tag = await Tag.findByPk(tagid);
    tag.nums = tag.nms - 1;
    if(tag.nums == 0){
        return await tag.destroy();
    }
    var paperlist = tag.papers.split(';');
    paperlist.splice(indexOf(paperid),1);
    tag.papers = paperlist.join(";");
    return await tag.save()
}

function put_paper_to_tag(paperid, tagtitle){
    var tagid = tag_id(tagtitle);
    if(tagid == -1){
        var tag = await Tag.create({
            title:tag.toLowerCase(),
        });
    }else{
        var tag = await Tag.findByPk(tagid);
    }
    tag.nums = tag.nms +1;
    var paperlist = tag.papers.split(';');
    paperlist.push(paperid)
    tag.papers = paperlist.join(";");
    
    return await tag.save()
}
module.exports={
    tag_id,
    get_tags,
    get_papers_by_tags,
    put_paper_to_tag,
    del_paper_from_tag
}
