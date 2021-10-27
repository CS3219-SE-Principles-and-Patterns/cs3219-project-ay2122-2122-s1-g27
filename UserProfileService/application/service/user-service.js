require('dotenv').config()
const bcrypt = require('bcrypt')

const ormUser = require('../orm/user-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')
const { InternalServerError, MissingArgsError } = require('./common')

exports.CreateUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const usernameNumWords = username.trim().split(' ').length
      if (usernameNumWords > 1) {
        // accept single word only
        return res.status(400).json(Response(STATUS_FAIL, 'Username must be single word'))
      }

      const usernameExist = await ormUser.UserExists(username)
      if (usernameExist.err) {
        throw usernameExist.err
      }
      if (!usernameExist) {
        // doesn't exist, can safely create
        const hashed = await bcrypt.hash(password, 10)
        const respOrm = await ormUser.CreateUser(username, hashed)
        if (!respOrm.err && respOrm) {
          // successfully created
          const resp = Response(STATUS_SUCCESS, 'User Successfully Created')
          return res.status(201).json(resp)
        }
        console.log('Cannot Create User: ', respOrm.err)
        const resp = Response(STATUS_FAIL, 'Cannot Create User')
        return res.status(400).json(resp)
      }
      console.log(`User-${username} already exists, rejecting CreateUser`)
      const resp = Response(STATUS_FAIL, 'User already exists')
      return res.status(409).json(resp)
    }
    return MissingArgsError('CreateUser', res)
  } catch (err) {
    return InternalServerError(err, 'CreateUser', res)
  }
}

// Not in use at the moment
exports.GetUserDetails = async (req, res) => {
  try {
    const { username } = req.body
    if (!username) {
      return res.status(400).json(Response(STATUS_FAIL, 'Wrong Schema'))
    }
    const respOrm = await ormUser.FindUser(username)
    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to get user details'))
    }
    const userDetails = {
      topics: respOrm.topics,
      difficulties: respOrm.difficulties,
    }
    return res
      .status(200)
      .json(Response(STATUS_SUCCESS, 'User Details successfully retrieved', userDetails))
  } catch (err) {
    return InternalServerError(err, 'GetUserDetails', res)
  }
}

// Not in use at the moment
exports.UpdatePreferences = async (req, res) => {
  try {
    const { username, topics, difficulties } = req.body
    if (!topics || !difficulties || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return res.status(400).json(Response(STATUS_FAIL, 'Wrong Schema'))
    }

    const respOrm = await ormUser.UpdatePreferences(username, topics, difficulties)
    if (respOrm.err) {
      return res.status(500).json(Response(STATUS_FAIL, 'Unable to update preferences'))
    }
    return res.status(200).json(Response(STATUS_SUCCESS, 'User successfully updated'))
  } catch (err) {
    return InternalServerError(err, 'UpdatePreferences', res)
  }
}
