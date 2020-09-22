const { Sequelize, DataTypes } = require('sequelize');
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
await Meeting.sync();

function get_meetings(){
    var meetings = await Meeting.findAll();
    return meetings.toJSON();
}

function get_papers_by_meetings(ids){
    var meetings = await Meeting.findAll({
        attributes:['papers'],
        where:{
            id:{
                [Op.or]:ids
            }
        }
    });
    var paper_ids = []
    meetings.every(meeting=>{
        paper_ids = paper_ids.concat(meeting.papers.split(';'))
    })
    return paper_ids;
}

function meeting_id(meetingtitle){
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

function del_paper_from_meeting(paperid,meetingtitle){
    var meetingid = meeting_id(meetingtitle);
    if(meetingid == -1)return null;
    var meeting = await Meeting.findByPk(meetingid);
    meeting.nums = meeting.nms - 1;
    if(meeting.nums == 0){
        return await meeting.destroy();
    }
    var paperlist = meeting.papers.split(';');
    paperlist.splice(indexOf(paperid),1);
    meeting.papers = paperlist.join(";");
    return await meeting.save()
}

function put_paper_to_meeting(paperid, meetingtitle){
    var meetingid = meeting_id(meetingtitle);
    if(meetingid == -1){
        var meeting = await Meeting.create({
            title:meeting.toLowerCase(),
        });
    }else{
        var meeting = await Meeting.findByPk(meetingid);
    }
    meeting.nums = meeting.nms +1;
    var paperlist = meeting.papers.split(';');
    paperlist.push(paperid)
    meeting.papers = paperlist.join(";");
    
    return await meeting.save()
}
module.exports={
    get_meetings,
    get_papers_by_meetings,
    meeting_id,
    put_paper_to_meeting,
    del_paper_from_meeting
}
