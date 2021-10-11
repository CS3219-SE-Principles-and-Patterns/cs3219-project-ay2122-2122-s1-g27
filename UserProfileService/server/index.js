const express = require('express')
const cors = require('cors')

const server = express()

// configure body parser
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors()) // config cors so that front-end can use
server.options('*', cors())

require("../controller")(server);

module.exports = server