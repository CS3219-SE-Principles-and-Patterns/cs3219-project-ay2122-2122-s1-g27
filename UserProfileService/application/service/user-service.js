require('dotenv').config()
const bcrypt = require('bcrypt')

const ormUser = require('../orm/user-orm')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../util/enums')
const { Response, InternalServerError, MissingArgsError } = require('./common')

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
