const express = require('express')
const boom = require('boom')
const fs = require("fs")
const config = require("../utils/config")
const localStorage = require("../utils/LocalStorage")

//api路由模块
const apiRouter = require('./api')
//page路由模块
const pageRouter = require('./pages')

const staticRouter = require('./static')

const storageRouter = require('./localStorage')

//导入jwt认证函数
const { jwtAuth } = require('../utils/user-jwt')
// const { renderSync } = require('node-sass')

// const {is_built} = require("../db/account");
//注册路由 
const router = express.Router()

//加入认证模块
router.use(jwtAuth)

router.get("/",(req,res)=>{
  res.redirect("/page/main");
})

router.get('/weights/:filename', function (req, res, next) {
  var f = fs.readFileSync(config.cwd+'/weights/'+req.params.filename, 'utf-8');
  res.send(f);
})

let uploadPath = config.cwd + '/storage/';

//加入用户模块路由
router.use('/api', apiRouter)
router.use('/page', pageRouter)
router.use('/static', staticRouter)
router.use('/storage', storageRouter([new localStorage(uploadPath)],{uploadPath}))
//自定义统一异常处理中间件，需要放在代码最后
router.use((err, req, res, next) => {
  //自定义用户认证失败的错误返回
  if (err && err.name === 'UnauthorizedError') {
    const errCode = 401;
    res.status(errCode).json({
      code: errCode,
      msg: "UnauthorizedError" 
    })
  } else {
    const { output } = err || {}
    //错误码和错误信息
    const errCode = (output && output.statusCode) || 500
    const errMsg = (output && output.payload && output.payload.error) || err.message
    res.status(errCode).json({
      code: errCode,
      msg: errMsg 
    })
  }
})

//导出路由
module.exports = router
