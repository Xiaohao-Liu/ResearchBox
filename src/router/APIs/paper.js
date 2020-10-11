const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const { decode } = require('../../utils/user-jwt')
const {Papers} = require('../../db')
const { user } = require('../../utils/config')

//登录
const add_new_Vaildator = [
  body('title').isString().withMessage('标题类型错误'),
  body('author1').isString().withMessage('名称类型错误'),
  body('Ptime').isString().withMessage('日期类型错误'),
]

router.post('/add', add_new_Vaildator, function (req, res, next) {
    let paper = req.body;
    Papers.insertPaper(paper).then(_ => {
        res.json({ code: 401, msg: '新增paper成功', data: {} });
    })
})

router.post('/del', function (req, res, next) {

    let id = req.body.id;
    Papers.deletePaper(id).then(_ => {
        res.json({ code: 401, msg: '删除paper成功', data: {} });
    })
})

router.get('/by_ntime_query', function (req, res, next) {
    Papers.getPapersQueryInfo().then(papers=>{
      res.json({ code: 401, msg: '查询paper query成功', data: papers });
    })
})

router.get('/by_page/:pagenum', function (req, res, next) {
  Papers.getPapersIDsByPage(req.params.pagenum).then(idlist=>{
      Papers.getPapersSimpleInfo(idlist).then(papers=>{
      res.json({ code: 401, msg: '查询paper lite', data: papers });
    })
  })
})

router.get('/fetchone/:id', function (req, res, next) {

      Papers.getPapersInfo([req.params.id]).then(papers=>{
        res.json({ code: 401, msg: '查询paper成功', data: papers });
      })
})

router.post('/uploadone', function (req, res, next) {
  Papers.set_paper_all(req.body.id, req.body.new_paper).then(
    _=>{
      res.json({ code: 401, msg: '更新paper成功', data: {}});
    }
  )

})

router.post('/add_paper_table', function (req, res, next) {
    var {paperid, tableid} = req.body;
    Papers.add_to_table(paperid,tableid).then(_=>{
      res.json({ code: 401, msg: 'table添加paper成功', data: {} });
    })
})

router.post('/rm_paper_table', function (req, res, next) {
  var {paperid, tableid} = req.body;
  Papers.rm_from_table(paperid,tableid).then(_=>{
    res.json({ code: 401, msg: 'table删除paper成功', data: {} });
  })
})

// //查询用户信息
// router.get('/info', function (req, res, next) {
//   //解析token,并且token存在
//   console.log("info")
//   const token = decode(req) || {}
//   findUser(token.username).then(user => {
//     if (user) {
//       res.json({ code: 0, msg: '用户信息查询成功', data: user })
//     } else {
//       res.json({ code: -1, msg: '用户信息查询失败', data: {} })
//     }
//   })
// })

module.exports = router

