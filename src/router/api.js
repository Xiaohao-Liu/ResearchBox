const express = require('express')
const router = express.Router()

const userR = require('./Apis/user')
const paperR = require('./APIs/paper')
const tagR = require('./APIs/tags')
const meetingR = require('./APIs/meetings')

router.use("/user", userR)
router.use("/paper", paperR)
router.use("/tag", tagR)
router.use("/meeting", meetingR)


module.exports = router