const onlineUsernameToSocketIDs = {}
const onlineSocketIDsToUsername = {}

const addOnlineUser = (username, socketID) => {
  onlineUsernameToSocketIDs[username] = socketID
  onlineSocketIDsToUsername[socketID] = username
  console.log('Currently online', onlineUsernameToSocketIDs)
}

const removeOnlineUser = (socketID) => {
  const username = onlineSocketIDsToUsername[socketID]
  console.log(`Removing SocketID: ${socketID} | Username: ${username}`)

  if (username !== undefined) {
    delete onlineUsernameToSocketIDs[username]
    delete onlineSocketIDsToUsername[socketID]
    console.log('Currently online', onlineUsernameToSocketIDs)
  }
}

const onlineHandler = (socket, _) => {
  socket.on('online', (username) => {
    addOnlineUser(username, socket.id)
  })
}

module.exports = {
  removeOnlineUser,
  onlineHandler,
}
