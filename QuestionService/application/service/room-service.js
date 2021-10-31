const { sha256 } = require('js-sha256')
const { Response, wrapResult } = require('../util/response')
const ormRoom = require('../orm/room-orm')
const ormQuestion = require('../orm/question-orm')
const { getRandomNumberBetweenInclMinExclMax } = require('../util/utilities')

// for generating room id

const SALT_1 = 32
const SALT_2 = 2

/**
 * Application Layer (Service) defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 * These contain the function definition of the HTTP Routes
 */

const CreateRoom = async (req, res) => {
  try {
    const { topics, difficulties, username1, username2 } = req.body

    const beforeHash = `${SALT_1}${username1}${SALT_2}${username2}`
    const hash = sha256(beforeHash)

    const matchedQuestions = await ormQuestion.FindMatchedQuestions(topics, difficulties)
    const randomIndex = getRandomNumberBetweenInclMinExclMax(0, matchedQuestions.length)
    const randomMatchedQuestion = matchedQuestions[randomIndex]

    const respOrm = await ormRoom.CreateRoom(randomMatchedQuestion, hash)

    return wrapResult(res, 'Cannot Create Room', 'Room Created', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const FindRoomById = async (req, res) => {
  try {
    const { roomId } = req.body

    const respOrmRoom = await ormRoom.FindRoom(roomId)

    let result = respOrmRoom

    if (!respOrmRoom.err) {
      const respOrmQuestion = await ormQuestion.FindQuestion(respOrmRoom.questionId)
      result = { roomId, question: respOrmQuestion }
    }

    return wrapResult(res, 'Cannot Find Room', 'Found Room', result)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

module.exports = {
  CreateRoom,
  FindRoomById,
}
