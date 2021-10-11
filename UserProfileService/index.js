const server = require('./server')

const config = require('./configs').development
// use process.env later
const { PORT } = config

server.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`)
})

module.exports = server
