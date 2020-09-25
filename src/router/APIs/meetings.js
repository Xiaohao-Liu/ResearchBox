const express = require('express')
const router = express.Router()
const md5 = require('../../utils/md5')
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const { decode } = require('../../utils/user-jwt')
const {Meeting,Papers} = require('../../db')
const { user } = require('../../utils/config')

router.get('/get', function (req, res, next) {

    Meeting.get_meetings().then(meetings => {
        res.json({ code: 401, msg: '查询meetings成功', data: meetings });
    })
})

router.post('/paper_by_meetings', function (req, res, next) {
      let {meetings} = req.body;
      Meeting.get_papers_by_meetings(meetings).then(ids => {
        Papers.getPapersSimpleInfo(ids).then(papers=>{
            res.json({ code: 401, msg: '查询paper  lite成功', data: papers });
          })
      })
  })
  

module.exports = router

