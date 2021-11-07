const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')

const { SocketController } = require('../controller/socketController')

const { JWT_SECRET_TOKEN } = process.env

// express app
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
require('../controller/routeController')(app)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

/**
 * Checks if connection contains Authorization header with JWT Token
 * Extracts and attaches username to socket for subsequent messages
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

io.of('/api/comm').use((socket, next) => {
  const header = socket.handshake.headers.authorization
  if (isValidJwt(header, socket)) {
    return next()
  }
  return next(new Error('authentication error'))
})

io.of('/api/comm').on('connection', (socket) => SocketController(socket, io))

module.exports = httpServer
