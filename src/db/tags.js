const { Sequelize, DataTypes,Op } = require('sequelize');
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
async function init(){await Tag.sync();}init();

async function  get_tags(){
    return await Tag.findAll({
        raw:true,
    });
    // var jsons = []
    // await tags.every(tag=>{
    //     jsons.push(tag.toJSON());
    // })

    // console.log(jsons)
    // return jsons;
}

async function  get_papers_by_tags(ids){
    var tags = await Tag.findAll({
        attributes:['papers'],
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true,
    });
    var paper_ids = []
    for(var i =0;i<tags.length;i++){
        paper_ids = paper_ids.concat(tags[i].papers.split(';'))
    }
    return paper_ids;
}

async function  tag_id(tagtitle){
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

async function  del_paper_from_tag(paperid,tagtitle){
    var tagid = await tag_id(tagtitle);
    if(tagid == -1)return null;
    var tag = await Tag.findByPk(tagid);
    tag.nums = tag.nums - 1;
    if(tag.nums <= 0){
        return await tag.destroy();
    }
    var paperlist = tag.papers.split(';');
    paperlist.splice(paperlist.indexOf(String(paperid)),1);
    tag.papers = paperlist.join(";");
    return await tag.save()
}

async function  put_paper_to_tag(paperid, tagtitle){
    var tagid = await tag_id(tagtitle);
    if(tagid == -1){
        var tag = await Tag.create({
            title:tagtitle.toLowerCase(),
        });
    }else{
        var tag = await Tag.findByPk(tagid);
    }
    
    var paperlist = tag.papers==null?[]:tag.papers.split(';');
    if(paperlist.indexOf(String(paperid))>=0) return null;
    tag.nums = tag.nums +1;
    paperlist.push(paperid)
    tag.papers = paperlist.join(";");
    return await tag.save()
}

async function getNum(){
    return await Tag.count();
}

async function getTop10(){
    return await Tag.findAll({
        attributes:['id','title','nums'],
        order:[
            ['nums','DESC']
        ],
        limit:10
    })
}

module.exports={
    tag_id,
    get_tags,
    getNum,
    getTop10,
    get_papers_by_tags,
    put_paper_to_tag,
    del_paper_from_tag
}
