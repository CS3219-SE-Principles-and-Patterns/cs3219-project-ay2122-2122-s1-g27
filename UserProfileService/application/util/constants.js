require('dotenv').config()

const ENV = process.env.ENV || 'development'
const config = require('../../configs')[ENV]

exports.MATCH_TIMEOUT_MS = 30000
const { questionServiceURL } = config
exports.CREATE_ROOM_ENDPOINT = `${questionServiceURL}/question/room`
