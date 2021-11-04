const { MatchHandler } = require('../application/handler/matchHandler')
/**
 *
 * @param {listener} socket listener instance
 * @param {socket.io::Server} Server instance of socket.io
 */
const socketController = (socket, io) => {
  // define socket.on and socket.emit functions over here
  // declare 'handlers' here, pass (socket, io) to functions defined in application/handler
  // see: https://socket.io/docs/v4/server-application-structure/

  socket.on('message', (msg1, msg2) => {
    console.log('Receiving Msg1: ', msg1)
    console.log('Receiving Msg2: ', msg2)
    io.emit('message', msg1, msg2)
  })

  MatchHandler(socket, io)

  socket.on('disconnect', (reason) => {
    console.log('Disconnecting reason', reason)
  })
}

module.exports = {
  socketController,
}
