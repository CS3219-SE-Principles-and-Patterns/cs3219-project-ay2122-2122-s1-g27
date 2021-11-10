require('dotenv').config()

const { PORT } = require('./configs')

const { httpServer, io } = require('./server')

httpServer.listen(PORT, () => {
  console.log(`CommunicationService up on PORT: ${PORT}`)
})
