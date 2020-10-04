const express = require('express')
const router = express.Router()

const userR = require('./APIs/user')
const paperR = require('./APIs/paper')
const tagR = require('./APIs/tags')
const meetingR = require('./APIs/meetings')
const planR = require("./APIs/plan")
const analysisR = require("./APIs/analysis")
const toolR = require("./APIs/tool")

router.use("/user", userR)
router.use("/paper", paperR)
router.use("/tag", tagR)
router.use("/meeting", meetingR)
router.use("/plan",planR)
router.use("/analysis",analysisR)
router.use("/tool",toolR)


module.exports = router