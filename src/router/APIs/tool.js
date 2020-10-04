const express = require('express')
const router = express.Router()

const request = require('request')
const translate = require('../../assets/translate')

router.post('/translate_cn', function (req, res, next) {
    let { query } = req.body;
    request(
        "https://translate.google.cn/translate_a/single?client=webapp&sl=en&tl=zh-CN&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=sos&dt=ss&dt=t&otf=2&ssel=0&tsel=0&xid=45662847&kc=1&tk="+translate.TL(query)+"&q="+query+"",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json({ code: 401, msg: '翻译成功', data: response })
            }
            else{
                res.json({ code: -1, msg: '翻译出错', data: {} })
            }
    })
})


module.exports = router

