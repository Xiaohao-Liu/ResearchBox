const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//导入自定义路由文件,创建模块化路由
const routes = require("../src/router")
const app = express()
const port = 9090
const config = require("./utils/config")
app.use(express.static(config.cwd + "/dist"));

//解析我们的form表单提交的数据,Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//解析json数据格式
app.use(bodyParser.json())  
//设置跨域
app.use(cors())
//导入自定义路由
app.use('/', routes)

const server = app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})

