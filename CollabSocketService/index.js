const express = require('express')

const http = require('http')
const { Server } = require('socket.io')
const fetch = require('cross-fetch')
const cors = require('cors')
const { createClient } = require('redis')
const { promisify } = require('util')

const { PORT, questionServiceURL, redisHost, redisPort, redisPw } = require('./configs')
// setting redis client and defining its async alternatives
const redisClient = createClient({
  host: redisHost,
  port: redisPort,
  password: redisPw,
})
const getAsync = promisify(redisClient.get).bind(redisClient)
const setAsync = promisify(redisClient.set).bind(redisClient)
const delAsync = promisify(redisClient.del).bind(redisClient)

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

const STARTING_CODE = 'x = "Hello World";'
const STARTING_LANG = 'javascript'

// socket io wrapper
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
io.of('/api/collab').on('connection', (socket) => {
  const header = socket.handshake.headers.authorization
  const jwt = header?.split(' ')[1]

  console.log(`${socket.id} connected with socket server wohoo!`)

  // To join room
  socket.on('room', async (data) => {
    const MAX_SOCKET_ROOMS_SIZE = 2 // Includes socket client id and one room id

    // means user is allowed to join room
    if (socket.rooms.size < MAX_SOCKET_ROOMS_SIZE) {
      const currCode = await getAsync(`${data.room}:CODE`).catch((err) => console.error(err))
      const currLang = await getAsync(`${data.room}:LANG`).catch((err) => console.error(err))
      // if code not in redis room, set it to default code
      if (currCode === null) {
        await setAsync(`${data.room}:CODE`, STARTING_CODE).catch((err) => console.error(err))
      } else {
        socket.to(data.room).emit('receive code', currCode)
      }
      // if lang not in redis room, set it to default lang
      if (currLang === null) {
        await setAsync(`${data.room}:LANG`, STARTING_LANG).catch((err) => console.error(err))
      } else {
        socket.to(data.room).emit('receive lang', currLang)
      }

      socket.join(data.room)
      socket.to(data.room).emit('new user joined')
      console.log(`emitted a new user joined in ${data.room}`)
    } else {
      console.log(`user : ${socket.id}already in another room. Cannot join this room: ${data.room}`)
    }
  })

  // When client is currently disconnecting from current service
  socket.on('disconnecting', async () => {
    // get rooms current client is in
    const rooms = Array.from(socket.rooms).filter((item) => item !== socket.id)

    // destroy room if noone else is present
    // eslint-disable-next-line no-restricted-syntax
    for (const room of rooms) {
      const numClientsInRoom = io.of('/api/collab').adapter.rooms.get(room).size
      if (numClientsInRoom <= 1) {
        // send API call to destroy room
        console.log('going to destroy room now')

        const delCode = await delAsync(`${room}:CODE`)
        const delLang = await delAsync(`${room}:LANG`)
        if (delCode && delLang) {
          console.log('redis room data deleted successfully')
        }

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
  socket.on('coding event', async (data) => {
    await setAsync(`${data.room}:CODE`, data.newCode).catch((err) => console.log(err))
    const codeToSend = await getAsync(`${data.room}:CODE`).catch((err) => console.error(err))
    if (data.newCode !== codeToSend) {
      console.error('Error when setting code change to Redis')
    }
    if (codeToSend !== null) {
      socket.to(data.room).emit('receive code', codeToSend)
    }
  })

  // When programming language is selected by clients
  socket.on('lang event', async (data) => {
    await setAsync(`${data.room}:LANG`, data.newLang).catch((err) => console.error(err))
    const langToSend = await getAsync(`${data.room}:LANG`).catch((err) => console.error(err))

    if (data.newLang !== langToSend) {
      console.error('Error when setting lang change to Redis')
    }

    if (langToSend) {
      // io.to(data.room).emit("receive lang", langToSend); //io.to not working in async for some reason but no time to die
      socket.to(data.room).emit('receive lang', langToSend)
    }
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
