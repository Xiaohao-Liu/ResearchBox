const express = require('express')
const router = express.Router()

const userR = require('./Apis/user')
const paperR = require('./APIs/paper')
const tagR = require('./APIs/tags')
const meetingR = require('./APIs/meetings')
const planR = require("./APIs/plan")

router.use("/user", userR)
router.use("/paper", paperR)
router.use("/tag", tagR)
router.use("/meeting", meetingR)
router.use("/plan",planR)

module.exports = router