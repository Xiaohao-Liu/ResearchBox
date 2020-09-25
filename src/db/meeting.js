const { Sequelize, DataTypes,Op } = require('sequelize');
const {sequelize} = require("./init");

const Meeting = sequelize.define('Meeting', {
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
async function init(){await Meeting.sync();}init();

async function  get_meetings(){
    return await Meeting.findAll({
        raw:true,
    });
    // var jsons = []
    // await meetings.every(meeting=>{
    //     jsons.push(meeting.toJSON());
    // })

    // console.log(jsons)
    // return jsons;
}

async function  get_papers_by_meetings(ids){
    var meetings = await Meeting.findAll({
        attributes:['papers'],
        where:{
            id:{
                [Op.or]:ids
            }
        },
        raw:true,
    });
    var paper_ids = []
    for(var i =0;i<meetings.length;i++){
        paper_ids = paper_ids.concat(meetings[i].papers.split(';'))
    }
    return paper_ids;
}

async function  meeting_id(meetingtitle){
    var meeting = await Meeting.findOne(
        {
            attributes:['id'],
            where:{
                title:meetingtitle
            }
        }
    )
    return meeting != null?meeting.id:-1;
}

async function  del_paper_from_meeting(paperid,meetingtitle){
    var meetingid = await meeting_id(meetingtitle);
    if(meetingid == -1)return null;
    var meeting = await Meeting.findByPk(meetingid);
    meeting.nums = meeting.nums - 1;
    if(meeting.nums <= 0){
        return await meeting.destroy();
    }
    var paperlist = meeting.papers.split(';');
    paperlist.splice(paperlist.indexOf(String(paperid)),1);
    meeting.papers = paperlist.join(";");
    return await meeting.save()
}

async function  put_paper_to_meeting(paperid, meetingtitle){
    var meetingid = await meeting_id(meetingtitle);
    if(meetingid == -1){
        var meeting = await Meeting.create({
            title:meetingtitle.toLowerCase(),
        });
    }else{
        var meeting = await Meeting.findByPk(meetingid);
    }
    
    var paperlist = meeting.papers==null?[]:meeting.papers.split(';');
    if(paperlist.indexOf(String(paperid))>=0) return null;
    meeting.nums = meeting.nums +1;
    paperlist.push(String(paperid))
    meeting.papers = paperlist.join(";");
    return await meeting.save()
}

async function getNum(){
    return await Meeting.count();
}

async function getTop10(){
    return await Meeting.findAll({
        attributes:['id','title','nums'],
        order:[
            ['nums','DESC']
        ],
        limit:10
    })
}

module.exports={
    get_meetings,
    get_papers_by_meetings,
    meeting_id,
    getNum,
    getTop10,
    put_paper_to_meeting,
    del_paper_from_meeting
}
