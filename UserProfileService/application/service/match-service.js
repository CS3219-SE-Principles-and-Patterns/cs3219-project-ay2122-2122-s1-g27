const ormMatch = require('../orm/match-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')
const { InternalServerError, MissingArgsError } = require('./common')

// WARNING: This service is not supposed to be used in production, just for testing/debugging purposes!

exports.FindUserMatched = async (req, res) => {
  try {
    const { username } = req.params
    const respOrm = await ormMatch.FindUserMatched(username)
    if (respOrm === null) {
      return res.status(404).json(Response(STATUS_SUCCESS, 'No Match Found', []))
    }
    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to find match!'))
    }
    return res.status(200).json(Response(STATUS_SUCCESS, 'Find Match Successful', respOrm))
  } catch (err) {
    return InternalServerError(err, 'FindUserMatch', res)
  }
}

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

exports.DeleteExpiredMatches = async (req, res) => {
  try {
    const respOrm = await ormMatch.RemoveExpiredMatches()
    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to Delete Expired Matches'))
    }
    return res.status(200).json(Response(STATUS_SUCCESS, 'Successfully Deleted Expired Matches'))
  } catch (err) {
    return InternalServerError(err, 'DeleteExpiredMatches', res)
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

    return res.status(200).json(Response(STATUS_SUCCESS, 'Successfully Find Match', respOrm))
  } catch (err) {
    return InternalServerError(err, 'FindMatch', res)
  }
}
