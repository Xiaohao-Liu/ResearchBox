const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { decode } = require('../../utils/user-jwt')
const {Account} = require('../../db')
const  request  = require('request')

router.get('/:path', function (req, res, next) {

    Account.get_account().then(userinfo=>{
        let github_info = JSON.parse(userinfo.github_info)
        request.get("https://gitee.com/"+github_info.username+"/"+github_info.repos+"/raw/master/"+req.params.path, (err,resu,body)=>{
            res.json({ code: 401, msg: '', data: body });
        })
    })
})



module.exports = router

