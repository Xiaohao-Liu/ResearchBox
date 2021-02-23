const router = require("express").Router(),
    multer = require("multer");

const config = require("../utils/config");
const file2password = require("../utils/file_passwords")
const md5 = require("../utils/md5");
module.exports = function (storages, options = {}) {
    let uploadPath = options.uploadPath || require("os").tmpdir();
    for (let storage of storages) {

        // `list` endpoint
        router.get(`/${storage.code}/list`, async function (req, res) {
            let result = await storage.list(req.query.path);
            return res.json(result);
        });

        // `upload` endpoint
        router.post(`/${storage.code}/upload`, multer({ dest: uploadPath }).array("files"), async function (req, res) {
            await storage.upload(req.query.path, req.files);
            return res.sendStatus(200);
        });

        // `mkdir` endpoint
        router.post(`/${storage.code}/mkdir`, async function (req, res) {
            await storage.mkdir(req.query.path, req.query.name);
            return res.sendStatus(200);
        });

        // `delete` endpoint
        router.post(`/${storage.code}/delete`, async function (req, res) {
            await storage.delete(req.query.path);
            return res.sendStatus(200);
        });

        // `list` endpoint
        router.get(`/${storage.code}/download/:filename`, async function (req, res) {
            let pwd = req.query.p;
            let _ = req.query.path.split(".")
            let filetype = _[_.length-1];
            if(filetype in {"png":'',"jpg":''}){
                let result = await storage.get(req.query.path);
                return res.send(result);
            }

            if(req.query.path in file2password && pwd == md5(file2password[req.query.path])){
                let result = await storage.get(req.query.path);
                return res.send(result);
            }
            else if((!(req.query.path in file2password)) && pwd == md5(config.default_file_password)){
                let result = await storage.get(req.query.path);
                return res.send(result);
            }
            return res.send({code:401,data:"wrong password"})
        });
    }
    return router;
}
