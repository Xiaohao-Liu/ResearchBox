const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const { decode } = require('../../utils/user-jwt')
const {Tags,Papers} = require('../../db')
const { user } = require('../../utils/config')

router.get('/get', function (req, res, next) {
  const err = validationResult(req)
  
  //如果验证错误,empty不为空
  if (!err.isEmpty()) {
    //获取错误信息
    const [{ msg }] = err.errors
    //抛出错误,交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg))
  } else {
    Tags.get_tags().then(tags => {
        res.json({ code: 401, msg: '查询tags成功', data: tags });
    })
  }
})

router.post('/paper_by_tags', function (req, res, next) {
    const err = validationResult(req)
    
    //如果验证错误,empty不为空
    if (!err.isEmpty()) {
      //获取错误信息
      const [{ msg }] = err.errors
      //抛出错误,交给我们自定义的统一异常处理程序进行错误返回 
      next(boom.badRequest(msg))
    } else {
      let {tags} = req.body;
      Tags.get_papers_by_tags(tags).then(md5_titles => {
        Papers.getPapersInfo(md5_titles).then(papers=>{
            res.json({ code: 401, msg: '查询paper成功', data: papers });
          })
      })
    }
  })
  

module.exports = router

