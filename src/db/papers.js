// var { client } = require("./init");
var  {put_paper_to_meeting,del_paper_from_meeting} = require("./meeting");
var  {put_paper_to_tag,del_paper_from_tag} = require("./tags");
var {put_paper_to_table,del_paper_from_table} = require('./plan');


const { Sequelize, DataTypes,Op } = require('sequelize');
const {sequelize} = require("./init");
const {papers_per_page} = require("../utils/config");

const Paper = sequelize.define('Paper', {
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
  },
  author1:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  author2:{
    type: DataTypes.STRING
  },
  background:{
    type: DataTypes.STRING,
  },
  process:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  meeting:{
      type:DataTypes.STRING
  },
  tags:{
      type:DataTypes.TEXT
  },
  tables:{
    type:DataTypes.TEXT
    },
  md:{
    type:DataTypes.TEXT
    },
  abstract:{
    type:DataTypes.TEXT
    },
  cite:{
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  link:{
      type:DataTypes.STRING
  },
  Ptime:{
      type:DataTypes.DATE,
      allowNull: false,
  },
  Ntime:{
      type:DataTypes.DATE,
  }
}, {
    timestamps: true,
    createdAt:"Ntime",
  // Other model options go here
});
async function init(){await Paper.sync();}init();

async function  insertPaper(paper){
    // console.log(paper.Ptime)
    var paper_ = await Paper.create({
        title:paper.title,
        author1:paper.author1,
        Ptime:parseInt(paper.Ptime)
    })
    return await paper_.save()
}

async function  getPaperByNtime(){
    var papers = await Paper.findAll(
        {
            attributes:['id'],
            raw:true,
        }
        );
    var ids = [];
    for(var i =0 ;i < papers.length;i++){
        ids.push(papers[i].id)
    }
    return ids;
}

async function  getPapersInfo(ids){
    return await Paper.findAll({
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true,
    });
    // var jsons = [];
    // await papers.every(paper=>{
    //     jsons.push(paper.toJSON())
    // })
    // return jsons;
}

async function  getPapersSimpleInfo(ids){
    return await Paper.findAll({
        attributes:['id','title','tags','meeting','Ptime','Ntime','process','background','tables'],
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true,
    });
}

async function  getPapersQueryInfo(){
    return await Paper.findAll({
        attributes:['id','title','process','link'],
        raw:true,
    });
}

async function  getPapersIDsByPage(pagenum){
    var papers =  await Paper.findAll({
        attributes:['id'],
        offset:(pagenum-1)*papers_per_page,
        limit:papers_per_page,
        raw:true,
        order:[
            ['updatedAt','DESC']
        ],
    });
    var ids = [];
    for(var i =0 ;i < papers.length;i++){
        ids.push(papers[i].id)
    }
    return ids;
}


async function  deletePaper(id){
    var paper = await Paper.findByPk(id);
    var old_tags = paper.tags==null?[]:paper.tags.split(";");
    var old_tables = paper.tables == null?[]:paper.tables.split(";");
    var old_meeting = paper.meeting;

    var stack = []
    for(let i = 0;i<old_tags.length;i++){
        stack.push(del_paper_from_tag(id,old_tags[i].split(" ").join("+")));
    }
    for(let i = 0;i<old_tables.length;i++){
        stack.push(del_paper_from_table(id,old_tables[i].split(" ").join("+")));
    }
    stack.push(del_paper_from_meeting(id,old_meeting));
    await Promise.all(stack)
    return await paper.destroy()
}

async function  set_paper_all(id, new_paper){
    var paper = await Paper.findByPk(id);
    var old_tags = paper.tags==null?[]:paper.tags.split(";");
    var new_tags = new_paper.tags==''?[]:new_paper.tags.split(";");
    var old_meeting = paper.meeting==null?"":paper.meeting;
    var new_meeting = new_paper.meeting==null?"":new_paper.meeting;
    new_paper.Ptime = parseInt(new_paper.Ptime);
    new_paper.process = parseInt(new_paper.process);
    new_paper.cite = parseInt(new_paper.cite);
    // console.log(new_paper)
    for(var key in new_paper){if(key=="Ntime"){continue;}paper[key] = new_paper[key];}
    // console.log(new_paper.background)
    
    var stack = []
    for(let i = 0;i<old_tags.length;i++){
        if(new_tags.indexOf(old_tags[i])<0){
            stack.push(del_paper_from_tag(id,old_tags[i].split(" ").join("+")));
        }
    }
    for(let i = 0;i<new_tags.length;i++){
        if(old_tags.indexOf(new_tags[i])<0){
            stack.push(put_paper_to_tag(id,new_tags[i].split(" ").join("+")));
        }
    }
    // console.log(old_meeting,new_meeting)
    if(old_meeting!=new_meeting){
        if(old_meeting!='')stack.push(del_paper_from_meeting(id,old_meeting));
        if(new_meeting!='')stack.push(put_paper_to_meeting(id,new_meeting));
    }
    await Promise.all(stack)
    return await paper.save();
}

async function add_to_table(paperid, tableid){
    var paper = await Paper.findByPk(paperid);
    var old_tables = paper.tables==null?[]:paper.tables.split(";");
    if(old_tables.indexOf(String(tableid))<0){

        old_tables.push(tableid)
        paper.tables = old_tables.join(';');
        await put_paper_to_table(paperid,tableid);
        return await paper.save();
    }
    return null;
};

async function rm_from_table(paperid, tableid){
    var paper = await Paper.findByPk(paperid);
    var old_tables = paper.tables==null?[]:paper.tables.split(";");
    if(old_tables.indexOf(String(tableid))>=0){
        old_tables.splice(old_tables.indexOf(tableid),1);
        paper.tables = old_tables.join(';');
        await del_paper_from_table(paperid,tableid);
        return await paper.save();
    }
    return null;
};


async function getNum(){
    return await Paper.count();
}
async function getNumByTime(){
    return await Paper.count({
        group:"Ptime",
        order:[["Ptime"]],
        attributes: ['Ptime']
    });
}

async function getRecents(){
    return await Paper.findAll({
        attributes:['id','title','process','tags','updatedAt','author1'],
        order:[
            ['updatedAt','DESC']
        ],
        limit:5
    })
}

module.exports={
    insertPaper,
    getPaperByNtime,
    getPapersInfo,
    getNum,
    getNumByTime,
    getRecents,
    getPapersSimpleInfo,
    deletePaper,
    add_to_table,
    getPapersQueryInfo,
    getPapersIDsByPage,
    // set_paper_title,
    // set_paper_author1,
    // set_paper_author2,
    // set_paper_cite,
    // set_paper_link,
    // set_paper_meeting,
    // set_paper_process,
    // set_paper_ptime,
    // set_paper_tags,
    rm_from_table,
    set_paper_all
}