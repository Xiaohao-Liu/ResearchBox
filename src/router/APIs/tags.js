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

    Tags.get_tags().then(tags => {
        res.json({ code: 401, msg: '查询tags成功', data: tags });
    })
})

router.post('/paper_by_tags', function (req, res, next) {
      let {tags} = req.body;
      Tags.get_papers_by_tags(tags).then(ids => {
        Papers.getPapersSimpleInfo(ids).then(papers=>{
            res.json({ code: 401, msg: '查询paper  lite成功', data: papers });
          })
      })
  })
  

module.exports = router

