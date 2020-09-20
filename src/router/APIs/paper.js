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
  const err = validationResult(req)
  
  //如果验证错误,empty不为空
  if (!err.isEmpty()) {
    //获取错误信息
    const [{ msg }] = err.errors
    //抛出错误,交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg))
  } else {
    let paper = req.body;
    Papers.insertPaper(paper).then(_ => {
        res.json({ code: 401, msg: '新增paper成功', data: {} });
    })
  }
})

router.post('/del', function (req, res, next) {
  const err = validationResult(req)
  
  //如果验证错误,empty不为空
  if (!err.isEmpty()) {
    //获取错误信息
    const [{ msg }] = err.errors
    //抛出错误,交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg))
  } else {
    let md5_title = req.body.md5_title;
    Papers.deletePaper(md5_title).then(_ => {
        res.json({ code: 401, msg: '删除paper成功', data: {} });
    })
  }
})

router.get('/by_ntime', function (req, res, next) {
  Papers.getPaperByNtime().then(
    ntimelist=>{
      Papers.getPapersInfo(ntimelist).then(papers=>{
        res.json({ code: 401, msg: '查询paper成功', data: papers });
      })
    }
  )

})

router.get('/fetchone/:md5_title', function (req, res, next) {

      Papers.getPapersInfo([req.params.md5_title]).then(papers=>{
        res.json({ code: 401, msg: '查询paper成功', data: papers });
      })
})

router.post('/uploadone', function (req, res, next) {
  Papers.set_paper_all(req.body.md5_title, req.body.new_paper).then(
    _=>{
      res.json({ code: 401, msg: '更新paper成功', data: {md5_title:md5(req.body.new_paper.title)} });
    }
  )

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

