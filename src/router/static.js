const express = require('express')
const router = express.Router()
const fs = require("fs")
const config = require("../utils/config")

router.get('/uploads/:filename', function (req, res, next) {
    
    var file = fs.readFileSync(config.cwd+'/uploads/'+req.params.filename);
    res.send(file);
})

module.exports = router

