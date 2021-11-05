const { sha256 } = require('js-sha256')

const { Response, WrapResult, UnauthorizedError } = require('./common')
const ormRoom = require('../orm/room-orm')
const ormQuestion = require('../orm/question-orm')
const { GetRandomNumberBetweenInclMinExclMax } = require('../util')

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
    const randomIndex = GetRandomNumberBetweenInclMinExclMax(0, matchedQuestions.length)
    const randomMatchedQuestion = matchedQuestions[randomIndex]

    const usernames = [username1, username2]

    const respOrm = await ormRoom.CreateRoom(randomMatchedQuestion, hash, usernames)

    return WrapResult(res, 'Cannot Create Room', 'Room Created', respOrm)
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
      const roomUsernames = result.usernames // array
      if (!roomUsernames.includes(req.user)) {
        return UnauthorizedError('FindRoomById', res)
      }
      const respOrmQuestion = await ormQuestion.FindQuestion(respOrmRoom.questionId)
      result = { question: respOrmQuestion }
    }

    return WrapResult(res, 'Cannot Find Room', 'Found Room', result)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const DeleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params

    // Check if deleter is one of the users
    const findRoomOrm = await ormRoom.FindRoom(roomId)
    if (!findRoomOrm.err) {
      const roomUsernames = findRoomOrm.usernames // array
      if (!roomUsernames.includes(req.user)) {
        return UnauthorizedError('DeleteRoom', res)
      }
    }

    const respOrmRoom = await ormRoom.DeleteRoom(roomId)

    return WrapResult(res, 'Cannot Delete Room', 'Deleted Room', respOrmRoom)
  } catch (err) {
    console.log('err: ', err)
    const resp = Response('Failure', 'DB failed')
    return res.status(500).send(resp)
  }
}

const GetCurrentRoomByUsername = async (req, res) => {
  try {
    const { username } = req.params
    if (username !== req.user) {
      return UnauthorizedError('GetCurrentRoomByUsername', res)
    }
    const respOrmRoom = await ormRoom.FindRoomByUsername(username)

    const result = respOrmRoom

    return WrapResult(res, 'Cannot Find Room', 'Found Room', result)
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
