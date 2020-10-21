// var { client } = require("./init");

const { Sequelize, DataTypes,Op } = require('sequelize');
const {sequelize} = require("./init");
const {papers_per_page} = require("../utils/config");

const Knowledge = sequelize.define('Knowledge', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  md:{
    type:DataTypes.TEXT
    },
  papers:{
    type: DataTypes.STRING,
  },
  Ntime:{
      type:DataTypes.DATE,
  }
}, {
    timestamps: true,
    createdAt:"Ntime",
  // Other model options go here
});
async function init(){await Knowledge.sync();}init();

async function  insertKnowledge(knowledge){
    // console.log(paper.Ptime)
    var knowledge_ = await Knowledge.create({
        key:knowledge.key,
    })
    return await knowledge_.save()
}

async function  getKnowledgesInfo(ids){
    return await Knowledge.findAll({
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true,
    });
}

async function  getKnowledgesIDsByKey(key){
    var knowledges =  await Knowledge.findAll({
        attributes:['id'],
        where:{
            key:{
                [Op.like]:"%"+key+"%"
            }
        },
        raw:true,
    });
    var ids = [];
    for(var i =0 ;i < knowledges.length;i++){
        ids.push(knowledges[i].id)
    }
    return ids;
}


async function  deleteKnowledge(id){
    var knowledge = await Knowledge.findByPk(id);
    return await knowledge.destroy()
}

async function  set_knowledge_all(id, new_knowledge){
    var knowledge = await Knowledge.findByPk(id);
    knowledge.key = new_knowledge.key;
    knowledge.md = new_knowledge.md;
    knowledge.papers = new_knowledge.papers;
    return await knowledge.save();
}


async function getNum(){
    return await Knowledge.count();
}

async function getRecents(){
    return await Knowledge.findAll({
        attributes:['id','key'],
        order:[
            ['updatedAt','DESC']
        ],
        limit:5
    })
}

module.exports={
    insertKnowledge,
    getKnowledgesIDsByKey,
    getNum,
    getRecents,
    getKnowledgesInfo,
    deleteKnowledge,
    set_knowledge_all
}