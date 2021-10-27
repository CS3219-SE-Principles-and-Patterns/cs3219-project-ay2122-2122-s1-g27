const { FindUser } = require('../orm/user-orm')

const onlineUsernameToUserDetails = {}
const onlineSocketIDsToUsername = {}

const GetUsernameOfSocketID = (socketID) => {
  if (socketID in onlineSocketIDsToUsername) {
    return onlineSocketIDsToUsername[socketID]
  }
  return false
}

const addOnlineUser = async (username, socketID) => {
  try {
    const userDetails = await FindUser(username)
    const { topics, difficulties } = userDetails
    onlineUsernameToUserDetails[username] = {
      socketID,
      topics,
      difficulties,
    }
    onlineSocketIDsToUsername[socketID] = username
    console.log('Currently online', onlineUsernameToUserDetails)
  } catch (err) {
    console.log(`Error, cannot add online user: ${err}`)
  }
}

const removeOnlineUser = (socketID) => {
  const username = onlineSocketIDsToUsername[socketID]
  console.log(`Removing SocketID: ${socketID} | Username: ${username}`)

  if (username !== undefined) {
    delete onlineUsernameToUserDetails[username]
    delete onlineSocketIDsToUsername[socketID]
    console.log('Currently online', onlineUsernameToUserDetails)
  }
}

const onlineHandler = (socket, _) => {
  socket.on('online', (username) => {
    addOnlineUser(username, socket.id)
  })
}

module.exports = {
  UsernameToDetailsMap: onlineUsernameToUserDetails,
  GetUsernameOfSocketID,
  removeOnlineUser,
  onlineHandler,
}
