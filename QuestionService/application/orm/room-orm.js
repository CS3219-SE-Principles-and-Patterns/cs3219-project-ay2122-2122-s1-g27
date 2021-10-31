const roomsRepo = require('../../infrastructure/persistence/room-repository')

exports.CreateRoom = async (randomMatchedQuestion, hash) => {
  try {
    if (!randomMatchedQuestion || !hash) {
      throw new Error('Room creation does not have both matched question and hash')
    }

    const deleteCondition = { roomId: hash }
    const replacement = {
      roomId: hash,
      questionId: randomMatchedQuestion.id,
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

    // const del = await roomsRepo.deleteRoom({ roomId: roomId })
    // console.log(del)

    const filter = { roomId }
    const currentRoom = await roomsRepo.findRoom(filter)
    if (!currentRoom) {
      throw new Error('No such room exists')
    }

    return currentRoom
  } catch (err) {
    console.log('Error in finding room with provided room id', err)
    return { err }
  }
}
