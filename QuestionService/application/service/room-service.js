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
    if (
      !Array.isArray(topics) ||
      !Array.isArray(difficulties) ||
      username1 == null ||
      username2 == null
    ) {
      return res.status(400).send(Response('Failure', 'Missing Schema'))
    }
    console.log(
      `Attempting to create room for user1: ${username1}, user2: ${username2}, topics: ${topics}, difficulties: ${difficulties}`
    )
    const beforeHash = `${SALT_1}${username1}${SALT_2}${username2}`
    const hash = sha256(beforeHash)

    const matchedQuestions = await ormQuestion.FindMatchedQuestions(topics, difficulties)
    const randomIndex = getRandomNumberBetweenInclMinExclMax(0, matchedQuestions.length)
    const randomMatchedQuestion = matchedQuestions[randomIndex]

    const usernames = [username1, username2]

    const respOrm = await ormRoom.CreateRoom(randomMatchedQuestion, hash, usernames)

    return wrapResult(res, 'Cannot Create Room', 'Room Created', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const FindRoomById = async (req, res) => {
  try {
    const { roomId } = req.params

    const respOrmRoom = await ormRoom.FindRoom(roomId)

    let result = respOrmRoom

    if (!respOrmRoom.err) {
      const respOrmQuestion = await ormQuestion.FindQuestion(respOrmRoom.questionId)
      result = { question: respOrmQuestion }
    }

    return wrapResult(res, 'Cannot Find Room', 'Found Room', result)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const DeleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params

    const respOrmRoom = await ormRoom.DeleteRoom(roomId)

    return wrapResult(res, 'Cannot Delete Room', 'Deleted Room', respOrmRoom)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const GetCurrentRoomByUsername = async (req, res) => {
  try {
    const { username } = req.params

    const respOrmRoom = await ormRoom.FindRoomByUsername(username)

    const result = respOrmRoom

    return wrapResult(res, 'Cannot Find Room', 'Found Room', result)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

module.exports = {
  CreateRoom,
  FindRoomById,
  DeleteRoom,
  GetCurrentRoomByUsername,
}
