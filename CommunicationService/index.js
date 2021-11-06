require('dotenv').config()

const { PORT } = require('./configs')

const server = require('./server')

server.listen(PORT, () => {
  console.log(`CommunicationService up on PORT: ${PORT}`)
})
