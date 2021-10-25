/**
 *
 * @param {listener} socket listener instance
 * @param {socket.io::Server} Server instance of socket.io
 */
const socketController = (socket, io) => {
  // define socket.on and socket.emit functions over here

  console.log('Socket ID', socket.id)

  socket.on('message', (msg) => {
    console.log('Receiving Msg: ', msg)
    io.emit('message', msg)
  })

  socket.on('disconnect', (reason) => {
    console.log('Disconnecting reason', reason)
  })
}

module.exports = {
  socketController,
}
