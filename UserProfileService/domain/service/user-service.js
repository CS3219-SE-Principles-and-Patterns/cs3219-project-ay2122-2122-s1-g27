require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ormUser = require('../orm/user-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')

/**
 * Service Layer defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 */

const { JWT_SECRET_TOKEN, REFRESH_TOKEN } = process.env
const refreshTokens = [] // TODO: change to Redis/Cache

const internalServerError = (err, from, res) => {
  console.log(`From: ${from}, Error: ${err}`)
  const resp = Response(STATUS_FAIL, 'DB Failure')
  return res.status(500).json(resp)
}

const missingArgsError = async (from, res) => {
  console.log(`From: ${from}`)
  const resp = Response(STATUS_FAIL, 'Missing HTTP Request Body Parameters')
  return res.status(400).json(resp)
}

const generateAccessToken = (username) => {
  return (token = jwt.sign({ username }, JWT_SECRET_TOKEN, { expiresIn: '2m' }))
}

// middleware for auth JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json(Response(STATUS_FAIL, 'No Authorization Token'))
  return jwt.verify(token, JWT_SECRET_TOKEN, (err, user) => {
    if (err) return res.status(403).json(Response(STATUS_FAIL, 'Your token is invalid'))
    console.log(`user-${user.username} is authenticated`)
    req.user = user
    return next()
  })
}

exports.CreateUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const usernameExist = await ormUser.UserExists(username)
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
    return missingArgsError('CreateUser', res)
  } catch (err) {
    return internalServerError(err, 'CreateUser', res)
  }
}

exports.LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const user = await ormUser.FindUser(username)
      if (user && user.password) {
        // exists, now check for correct hashed password
        if (await bcrypt.compare(password, user.password)) {
          // verified, create JWT
          const accessToken = generateAccessToken(username)
          const refreshToken = jwt.sign(username, REFRESH_TOKEN)
          refreshTokens.push(refreshToken)
          const resp = Response(STATUS_SUCCESS, 'Credentials Confirmed', {
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
          return res.status(200).json(resp)
        }
        const resp = Response(STATUS_FAIL, "Password doesn't match", [])
        return res.status(401).json(resp)
      }
      console.log(`User-${username} does not exist`)
      const resp = Response(STATUS_FAIL, "Provided username doesn't exist")
      return res.status(404).json(resp)
    }
    return missingArgsError('LoginUser', res)
  } catch (err) {
    return internalServerError(err, 'LoginUser', res)
  }
}

exports.RefreshToken = async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null)
    return res.sendStatus(401).json(Response(STATUS_FAIL, 'Token not present in Body'))
  if (!refreshTokens.includes(refreshToken))
    return res.sendStatus(403).json(Response(STATUS_FAIL, 'Access Denied'))
  jwt.verify(refreshToken, REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403).json(Response(STATUS_FAIL, 'Refresh Token Invalid'))
    const accessToken = generateAccessToken(user.username)
    res.json(Response(STATUS_SUCCESS, 'Refresh Token Success', { accessToken: accessToken }))
  })
}

// use this route to verify
exports.AuthRoute = async (req, res) => {
  authenticateToken(req, res, () =>
    res.status(200).json({
      status: 'success',
      message: 'Token is verified',
    })
  )
}
