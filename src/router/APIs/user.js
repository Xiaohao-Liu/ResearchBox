const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const { decode } = require('../../utils/user-jwt')
const {Account} = require('../../db')
const { user } = require('../../utils/config')
var multer = require('multer');//接收图片
const fs = require("fs");
var upload = multer({
    dest: './uploads'
});//定义图片上传的临时目录
//登录
const loginVaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

router.post('/first_set', function (req, res, next) {
  const err =  (req)

    let { username, password } = req.body;
    Account.set_account(username,password).then(
      user => {
        if (!user || user.length === 0) {
          res.json({ code: -1, msg: '初始化出错', data: {} })
        } else {
          res.redirect('/page/login');
        }
    })
})

router.post('/login',function (req, res, next) {

    let { username, password } = req.body;
    //md5加密
    password = md5(password)

    Account.get_account().then(user=>{
      if (user.username!=username || user.password!=password) {
        res.json({ code: -1, msg: '用户名或密码错误', data: {} })
      } else {
        //登录成功，签发一个token并返回给前端
        const token = jwt.sign(
          //playload：签发的 token 里面要包含的一些数据。
          { username },
          //私钥
          PRIVATE_KEY,
          { algorithm: 'HS256' },
          //设置过期时间
          { expiresIn: JWT_EXPIRED }
        )
        res.json({ code: 401, msg: 'Login', data: {},'token':token });
      }
    })
})

router.get('/info',function(req,res,next){
  Account.get_account().then(userinfo=>{
    res.json({ code: 401, msg: 'User_Info', data: userinfo });
  })
})
router.post('/setusername',function(req,res,next){
  let { username } = req.body;
  Account.set_username(username).then(_=>{
    res.json({ code: 401, msg: 'set username 成功', data: {} });
  })
})
router.post('/setpassword',function(req,res,next){
  let { password } = req.body;
  Account.set_password(password).then(_=>{
    res.json({ code: 401, msg: 'set password 成功', data: {} });
  })
})

router.post('/setgithub',function(req,res,next){
  let github_info = req.body;
  Account.set_github_info(github_info).then(_=>{
    res.json({ code: 401, msg: 'set github info 成功', data: {} });
  })
})

router.post('/uploadsidepic',upload.single('file'), function(req, res, next) {
  // req.file 是 前端表单name=="imageFile" 的文件信息（不是数组）
  // console.log(req.file)
  fs.rename(req.file.path,  "uploads/sidepic.jpg", function(err) {
      if (err) {
          throw err;
      }
      // console.log('上传成功!');
  })
  res.writeHead(200, {
      "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(req.file)+JSON.stringify(req.body));
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

