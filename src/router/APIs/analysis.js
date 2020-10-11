const express = require('express')
const router = express.Router()

const {Meeting,Papers,Tags,Plan} = require('../../db')

router.get('/nums', function (req, res, next) {
    Promise.all([
        Papers.getNum(),
        Meeting.getNum(),
        Tags.getNum(),
        Plan.getNum()
    ]).then(
        nums=>{
            res.json({ code: 401, msg: '查询数量成功', data: nums });
        }
    )
})

router.get('/paperrecents', function (req, res, next) {
    Papers.getRecents().then(
        papers=>{
            res.json({ code: 401, msg: '查询最近访问的Paper成功', data: papers });
        }
    )
})

router.get('/tag_top10', function (req, res, next) {
    Tags.getTop10().then(
        top10=>{
            res.json({ code: 401, msg: '查询Tag Top5成功', data: top10 });
        }
    )
})


router.get('/meeting_top10', function (req, res, next) {
    Meeting.getTop10().then(
        top10=>{
            res.json({ code: 401, msg: '查询Meeting Top5成功', data: top10 });
        }
    )
})


router.get('/table_top10', function (req, res, next) {
    Plan.getTop10().then(
        top10=>{
            res.json({ code: 401, msg: '查询Table Top5成功', data: top10 });
        }
    )
})



module.exports = router

