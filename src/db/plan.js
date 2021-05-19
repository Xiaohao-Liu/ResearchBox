const { Sequelize, DataTypes,Op } = require('sequelize');
const {sequelize} = require("./init");

const Plan = sequelize.define('Plan', {
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
async function init(){await Plan.sync();}init();

async function  insertTable(table){
    var table_ = await Plan.create({
        title:table.title
    });
    return await table_.save();
}

async function  delTable(id){
    var table = await Plan.findByPk(id);
    const stack = []
    for(let paperid in table.papers.split(";")){
      stack.push(del_paper_from_table(paperid,table.id))
    }
    stack.push(table.destroy())
    return await Promise.all(stack);
}

async function  getTablesByNtime(){
    return await Plan.findAll({attributes:['id','title','nums'],raw:true});
    // var jsons =[]
    // tables.every(table=>{jsons.push(table.toJSON())})
    // return jsons;
}

async function  getTablesInfo(ids){
    return await Plan.findAll({
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true
    });
}


async function  del_paper_from_table(paperid,tableid){

    var table = await Plan.findByPk(tableid);
    if(table != null){
      table.nums = table.nums - 1;
      var paperlist = table.papers==null?[]:table.papers.split(';');
      paperlist.splice(paperlist.indexOf(paperid),1);
      console.log(paperlist)
      table.papers = paperlist.join(";");
      return await table.save()
    }
    return null
}

async function  put_paper_to_table(paperid, tableid){
    // console.log(paperid,tableid)
    var table = await Plan.findByPk(tableid);
    table.nums = table.nums +1;
    var paperlist = table.papers==null?[]:table.papers.split(';');
    paperlist.push(paperid)
    table.papers = paperlist.join(";");
    return await table.save() 
}

async function getNum(){
  return await Plan.count();
}

async function getTop10(){
  return await Plan.findAll({
      attributes:['id','title','nums'],
      order:[
          ['nums','DESC']
      ],
      limit:10
  })
}


module.exports={
    insertTable,
    delTable,
    getNum,
    getTop10,
    getTablesByNtime,
    put_paper_to_table,
    del_paper_from_table,
    getTablesInfo,

}