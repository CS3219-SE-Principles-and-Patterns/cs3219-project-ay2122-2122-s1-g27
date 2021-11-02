const roomsRepo = require('../../infrastructure/persistence/room-repository')

exports.CreateRoom = async (randomMatchedQuestion, hash, usernames) => {
  try {
    if (!randomMatchedQuestion || !hash || !usernames) {
      throw new Error('Room creation does not have both matched question and hash')
    }

    if (!Array.isArray(usernames)) {
      throw new Error('usernames should be an array')
    }

    if (usernames.length !== 2) {
      throw new Error('usernames have a length of 2 corresponding to paired users')
    }

    const deleteCondition = { roomId: hash }
    const replacement = {
      roomId: hash,
      questionId: randomMatchedQuestion.id,
      usernames,
      created_at: Date.now(),
    }

    const room = await roomsRepo.createRoom(deleteCondition, replacement)
    room.save((err) => {
      if (err) {
        console.log(err)
        throw new Error('Save to database failed')
      }
    })

    return room.roomId
  } catch (err) {
    console.log('Error in creating room', err)
    return { err: err.message }
  }
}

exports.FindRoom = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error('Request has no id attribute')
    }

    const filter = { roomId }
    const currentRoom = await roomsRepo.findRoom(filter)

    if (currentRoom.length === 0 || !currentRoom[0]) {
      throw new Error('No such room exists')
    }

    return currentRoom[0]
  } catch (err) {
    console.log('Error in finding room with provided room id', err)
    return { err }
  }
}

exports.DeleteRoom = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error('Request has no id attribute')
    }

    const filter = { roomId }
    const deletedRoom = await roomsRepo.deleteRoom(filter)

    if (deletedRoom.deletedCount === 0) {
      throw new Error('No such room exists')
    }

    return deletedRoom
  } catch (err) {
    console.log('Error in finding room with provided room id', err)
    return { err }
  }
}

exports.FindRoomByUsername = async (username) => {
  try {
    if (!username) {
      throw new Error('Request has no required username')
    }

    const filter = { usernames: username }
    const currentRoom = await roomsRepo.findRoom(filter)

    if (currentRoom.length === 0 || !currentRoom[0]) {
      throw new Error('No such room exists')
    }

    return { roomId: currentRoom[0].roomId }
  } catch (err) {
    console.log('Error in finding room with provided username', err)
    return { err }
  }
}
