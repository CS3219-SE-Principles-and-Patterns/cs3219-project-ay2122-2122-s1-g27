require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const { socketController } = require('../controller/socketController')

const { JWT_SECRET_TOKEN } = process.env

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

/**
 * Checks if connection contains JWT authorization
 * attaches username to socket for subsequent messages
 * @param {string} header
 * @param {Socket} socket
 * @returns
 */
const isValidJwt = (header, socket) => {
  try {
    const jwtToken = header.split(' ')[1]
    return jwt.verify(jwtToken, JWT_SECRET_TOKEN, (err, jwtData) => {
      if (err) return false
      const { username } = jwtData
      // eslint-disable-next-line no-param-reassign
      socket.username = username
      return true
    })
  } catch (err) {
    return false
  }
}

io.use((socket, next) => {
  const header = socket.handshake.headers.authorization
  if (isValidJwt(header, socket)) {
    return next()
  }
  return next(new Error('authentication error'))
})
// Event Fired upon a new connection
io.on('connection', (socket) => socketController(socket, io))

// TODO: Define IO middleware by io.use [See: https://socket.io/docs/v4/middlewares/]

module.exports = httpServer
