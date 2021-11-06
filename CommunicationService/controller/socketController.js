exports.SocketController = (socket, io) => {
  console.log(`${socket.id} connected with socket server for text-chat!`)

  // leave room done automatically by socket.io
  socket.on('disconnect', () => {
    console.log('user disconnected from text-chat')
  })

  // create room for any 2 pairs of users
  socket.on('room', (data) => {
    console.log(`${String(data.username)} joins room ${String(data.room)}`)

    socket.join(data.room)
    io.in(data.room).emit('entryMessage', `${String(data.username)} connected to the chat`)
  })

  // user interaction via text-chat
  socket.on('interact', (data) => {
    console.log(`${String(data.username)}: ${String(data.message)}`)

    socket.to(data.room).emit('message', data.username, data.message)
  })
}
