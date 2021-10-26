const bcrypt = require('bcrypt')
const roomsRepo = require('../../infrastructure/persistence/room-repository')
const { FindMatchedQuestionUtility } = require('./question-orm')

// for generating room id
const saltRounds = 3
const saltRounds2 = 2
const salt = bcrypt.genSaltSync(saltRounds)
const salt2 = bcrypt.genSaltSync(saltRounds2)

exports.CreateRoom = async (topics, difficulties, username1, username2) => {
  try {
    if (!topics || !difficulties || !username1 || !username2) {
      throw new Error('Request has missing required attribute(s)')
    }

    const beforeHash = `${salt}${username1}${salt2}${username2}`
    const hash = String(bcrypt.hashSync(beforeHash, salt))

    const matchedQuestion = await FindMatchedQuestionUtility(topics, difficulties)

    const deleteCondition = { roomId: hash }
    const replacement = {
      roomId: hash,
      questionId: matchedQuestion.id,
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
    const currentRoomExists = await roomsRepo.findRoom(filter)
    if (!currentRoomExists) {
      throw new Error('No such room exists')
    }

    const currentQuestion = currentRoomExists

    return currentQuestion
  } catch (err) {
    console.log('Error in finding room with provided room id', err)
    return { err }
  }
}
