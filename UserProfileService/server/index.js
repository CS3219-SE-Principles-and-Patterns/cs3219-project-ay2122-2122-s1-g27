const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const { socketController } = require('../controller/socketController')

// define express app
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
require('../controller/routeController')(app) // add Router

// define WebSocket Server
const httpServer = createServer(app)
const io = new Server(httpServer, {
  /* options e.g. Path */
  cors: {
    origin: '*',
  },
})

// Event Fired upon a new connection
io.on('connection', (socket) => socketController(socket, io))

// TODO: Define IO middleware by io.use [See: https://socket.io/docs/v4/middlewares/]

module.exports = httpServer
