const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../../utils/constant')
const {Knowledge} = require('../../db')
const { user } = require('../../utils/config')
const knowledge = require('../../db/knowledge')


router.post('/add', function (req, res, next) {
    let knowledge = req.body;
    Knowledge.insertKnowledge(knowledge).then(_ => {
        res.json({ code: 401, msg: '新增konwledge成功', data: {} });
    })
})

router.post('/del', function (req, res, next) {
    let id = req.body.id;
    Knowledge.deleteKnowledge(id).then(_ => {
        res.json({ code: 401, msg: '删除knowledge成功', data: {} });
    })
})

router.post('/query', function (req, res, next) {
    let key = req.body.key;
    Knowledge.getKnowledgesIDsByKey(key).then(idlist => {
        Knowledge.getKnowledgesInfo(idlist).then(knowledges=>{
            res.json({ code: 401, msg: '查询knowledges成功', data: knowledges });
          })
    })
})
router.get('/fetchone/:id', function (req, res, next) {

      Knowledge.getKnowledgesInfo([req.params.id]).then(papers=>{
        res.json({ code: 401, msg: '查询knowledge成功', data: papers });
      })
})

router.post('/uploadone', function (req, res, next) {
  Knowledge.set_knowledge_all(req.body.id, req.body.new_knowledge).then(
    ()=>{
      res.json({ code: 401, msg: '更新knowledge成功', data: {}});
    }
  )

})



module.exports = router

