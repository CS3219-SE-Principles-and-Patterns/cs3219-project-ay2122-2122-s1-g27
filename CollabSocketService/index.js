const express = require('express')

const http = require('http')
const { Server } = require('socket.io')
const fetch = require('cross-fetch')
const cors = require('cors')
const { PORT, questionServiceURL } = require('./configs')

// express app
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.options('*', cors())

const router = express.Router()
router.get('/', (_, res) => {
  console.log('Req from root CollabSocketService')
  res.send('Hello World from CollabSocketService')
})

// routes must start with /api/collab
app.use('/api/collab', router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})

// socket io wrapper
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
io.of('/api/collab').on('connection', (socket) => {
  const header = socket.handshake.headers.authorization
  const jwt = header.split(' ')[1]

  console.log(`${socket.id} connected with socket server wohoo!`)

  // To join room
  socket.on('room', (data) => {
    const MAX_SOCKET_ROOMS_SIZE = 2 // Includes socket client id and one room id

    if (socket.rooms.size < MAX_SOCKET_ROOMS_SIZE) {
      // means user is allowed to join room
      socket.join(data.room)
      socket.to(data.room).emit('new user joined')
      console.log(`emitted a new user joined in ${data.room}`)
    } else {
      console.log(`user : ${socket.id}already in another room. Cannot join this room: ${data.room}`)
    }
  })

  // When client is currently disconnecting from current service
  socket.on('disconnecting', () => {
    // get rooms current client is in
    const rooms = Array.from(socket.rooms).filter((item) => item !== socket.id)

    // destroy room if noone else is present
    // eslint-disable-next-line no-restricted-syntax
    for (const room of rooms) {
      const numClientsInRoom = io.of('/api/collab').adapter.rooms.get(room).size
      if (numClientsInRoom <= 1) {
        // send API call to destroy room
        console.log('going to destroy room now')

        const requestOptions = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        }

        fetch(`${questionServiceURL}/api/question/room/${room}`, requestOptions).then(() =>
          console.log(`destroyed room:${room}`)
        )
      }
    }
  })

  // When client finishes disconnecting from current service
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`)
  })

  // When code is written in text editor by clients
  socket.on('coding event', (data) => {
    socket.to(data.room).emit('receive code', data.newCode)
  })

  // When programming language is selected by clients
  socket.on('lang event', (data) => {
    socket.to(data.room).emit('receive lang', data.newLang)
  })

  socket.on('finish', (data) => {
    socket.to(data.room).emit('finish triggered', data.room)
    socket.disconnect()
    console.log(`leaving ${data.room}`)
  })
})

server.listen(PORT, () => {
  console.log(`CollabSocketService started on port: ${PORT}`)
})
