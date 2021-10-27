const ormMatch = require('../orm/match-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')
const { InternalServerError, MissingArgsError } = require('./common')

// WARNING: This service is not supposed to be used in production, just for testing/debugging purposes!

exports.CreateMatch = async (req, res) => {
  try {
    const { username, socketID, topics, difficulties } = req.body
    if (!username || !socketID || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return MissingArgsError('CreateMatch', res)
    }

    const respOrm = await ormMatch.CreateMatch(username, socketID, topics, difficulties)

    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to CreateMatch'))
    }

    return res.status(201).json(Response(STATUS_SUCCESS, 'Create Successful'))
  } catch (err) {
    return InternalServerError(err, 'CreateMatch', res)
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

exports.FindMatch = async (req, res) => {
  try {
    const { topics, difficulties, username } = req.body
    if (!username || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return MissingArgsError('FindMatch', res)
    }

    const respOrm = await ormMatch.FindMatches(topics, difficulties, username)
    if (respOrm.err) {
      return res.status(400).json(Response(STATUS_FAIL, 'Unable to FindMatch'))
    }

    console.log('FindMatchResp', respOrm)
    return res.status(200).json(Response(STATUS_SUCCESS, 'Successfully Find Match', respOrm))
  } catch (err) {
    return InternalServerError(err, 'FindMatch', res)
  }
}
