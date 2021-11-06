exports.SocketController = (socket, io) => {
  const { username } = socket

  console.log(`SocketID:[${socket.id}], Username:[${username}] connected for text-chat!`)
  // leave room done automatically by socket.io
  socket.on('disconnect', () => {
    console.log('user disconnected from text-chat')
  })

  // create room for any 2 pairs of users
  socket.on('room', (data) => {
    console.log(`${username} joins room ${String(data.room)}`)

    socket.join(data.room)
    io.in(data.room).emit('entryMessage', `${String(username)} connected to the chat`)
  })

  // user interaction via text-chat
  socket.on('interact', (data) => {
    console.log(`${username}: ${String(data.message)}`)
    socket.to(data.room).emit('message', username, data.message)
  })
}
