const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const { decode } = require('../../utils/user-jwt')
const {Papers,Plan} = require('../../db')
const { user } = require('../../utils/config')

router.post('/add', function (req, res, next) {

    let table = req.body;
    Plan.insertTable(table).then(_ => {
        res.json({ code: 401, msg: '新增table成功', data: {} });
    })
  
})

router.post('/del', function (req, res, next) {  
    let ntime = req.body.ntime;
    Plan.delTable(ntime).then(_ => {
        res.json({ code: 401, msg: '删除table成功', data: {} });
    })
})

router.get('/by_ntime', function (req, res, next) {
  Plan.getTablesByNtime().then(
    ntimelist=>{
        res.json({ code: 401, msg: '查询tables成功', data: ntimelist });
    }
  )

})

router.get('/fetchone/:id', function (req, res, next) {

      Plan.getTablesInfo([req.params.id]).then(tables=>{
        res.json({ code: 401, msg: '查询table成功', data: tables });
      })
})

// router.post('/add_paper', function (req, res, next) {
//     var {paperid, tableid} = req.body;
//     Plan.put_paper_to_table(paperid,tableid).then(_=>{
//       res.json({ code: 401, msg: 'table添加paper成功', data: {} });
//     })
// })


router.post('/paper_by_table', function (req, res, next) {
    var {ids} = req.body;
    if(ids.length==0){
        res.json({ code: 401, msg: '查询paper  lite成功', data: [] });
        return;
    }
    Papers.getPapersSimpleInfo(ids).then(papers=>{
        res.json({ code: 401, msg: '查询paper  lite成功', data: papers });
    })
})

// router.post('/uploadone', function (req, res, next) {
//   Papers.set_paper_all(req.body.md5_title, req.body.new_paper).then(
//     _=>{
//       res.json({ code: 401, msg: '更新paper成功', data: {md5_title:md5(req.body.new_paper.title)} });
//     }
//   )

// })

module.exports = router

