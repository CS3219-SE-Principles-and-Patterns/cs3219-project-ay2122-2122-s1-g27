require('dotenv').config()
const server = require('./server')

const ENV = process.env.ENV || 'development'
const config = require('./configs')[ENV]
// use process.env later
const { PORT } = config

server.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`)
})

module.exports = server
