const express = require('express')
const router = express.Router()
const fs = require("fs")
const config = require("../utils/config")
const {is_built} = require("../db/account");

router.get('/login', function (req, res, next) {
    is_built().then(built=>{
        if(built=="false"){
            res.redirect('/page/first_set');
            console.log('redirect to first_set page')
            return;
        }else{
            var html = fs.readFileSync(config.cwd+'/dist/login.html', 'utf-8');
            res.send(html);
        }
    })
})

router.get('/first_set', function (req, res, next) {
    is_built().then(built=>{
        if(built=="true"){
            res.redirect('/page/login');
            console.log('redirect to login page')
            return;
        }else{
            var html = fs.readFileSync(config.cwd+'/dist/firstsetting.html', 'utf-8');
            res.send(html);
        }
    })
})

router.get('/main', function (req, res, next) {
    var html = fs.readFileSync(config.cwd+'/dist/main.html', 'utf-8');
    res.send(html);
})

router.get('/tool/translate', function (req, res, next) {
    var html = fs.readFileSync(config.cwd+'/dist/translate.html', 'utf-8');
    res.send(html);
})
router.get('/tool/crypto', function (req, res, next) {
    var html = fs.readFileSync(config.cwd+'/dist/crypto.html', 'utf-8');
    res.send(html);
})

router.get('/tool/piclinks', function (req, res, next) {
    var html = fs.readFileSync(config.cwd+'/dist/piclinks.html', 'utf-8');
    res.send(html);
})

router.get('/tool/knowledge', function (req, res, next) {
    var html = fs.readFileSync(config.cwd+'/dist/knowledge.html', 'utf-8');
    res.send(html);
})

module.exports = router

