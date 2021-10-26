const { Response, wrapResult } = require('../util/response')
const ormRoom = require('../orm/room-orm')

/**
 * Application Layer (Service) defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 * These contain the function definition of the HTTP Routes
 */

const CreateRoom = async (req, res) => {
  try {
    const { topics, difficulties, username1, username2 } = req.body
    const respOrm = await ormRoom.CreateRoom(topics, difficulties, username1, username2)
    return await wrapResult(res, 'Cannot Create Room', 'Room Created', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const FindRoomById = async (req, res) => {
  try {
    const { roomId } = req.body
    const respOrm = await ormRoom.FindRoom(roomId)
    return await wrapResult(res, 'Cannot Find Room', 'Found Room', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

module.exports = {
  CreateRoom,
  FindRoomById,
}
