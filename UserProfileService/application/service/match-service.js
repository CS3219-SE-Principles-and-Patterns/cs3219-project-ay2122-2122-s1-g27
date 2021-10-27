const ormMatch = require('../orm/match-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')
const { InternalServerError, MissingArgsError } = require('./common')

// WARNING: This service is not supposed to be used in production, just for testing/debugging purposes!

exports.CreateMatch = async (req, res) => {
  try {
    const { username, socketID, topics, difficulties } = req.body
    if (!username || !socketID || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return MissingArgsError('MatchUser', res)
    }

    const respOrm = await ormMatch.CreateMatch(username, socketID, topics, difficulties)

    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to CreateMatch'))
    }

    return res.status(201).json(Response(STATUS_SUCCESS, 'Create Successful'))
  } catch (err) {
    return InternalServerError(err, 'MatchUser', res)
  }
}

exports.DeleteMatch = async (req, res) => {
  try {
    const { username } = req.body
    if (!username) {
      return MissingArgsError('DeleteMatch', res)
    }

    const respOrm = await ormMatch.RemoveMatch(username)

    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to CreateMatch'))
    }

    return res.status(200).json(Response(STATUS_SUCCESS, 'Successfully Delete Match'))
  } catch (err) {
    return InternalServerError(err, 'DeleteMatch', res)
  }
}
