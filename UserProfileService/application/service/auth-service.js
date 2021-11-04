require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ormUser = require('../orm/user-orm')
const { Response } = require('../../util/response')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../../util/enums')
const { InternalServerError, MissingArgsError } = require('./common')

const { JWT_SECRET_TOKEN, REFRESH_TOKEN } = process.env

const refreshTokens = [] // TODO: change to Redis/Cache

const generateAccessToken = (username) => jwt.sign({ username }, JWT_SECRET_TOKEN) // no expiry for now

// middleware for auth JWT
exports.AuthenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json(Response(STATUS_FAIL, 'No Authorization Token'))
  return jwt.verify(token, JWT_SECRET_TOKEN, (err, jwtData) => {
    if (err) return res.status(403).json(Response(STATUS_FAIL, 'Your token is invalid or expired'))
    const extractedUsername = jwtData.username
    req.user = extractedUsername // pass on to next
    console.log(`user-${extractedUsername} is authenticated`)
    return next()
  })
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
            accessToken,
            refreshToken,
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
    return MissingArgsError('LoginUser', res)
  } catch (err) {
    return InternalServerError(err, 'LoginUser', res)
  }
}

exports.RefreshToken = async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null)
    return res.sendStatus(401).json(Response(STATUS_FAIL, 'Token not present in Body'))
  if (!refreshTokens.includes(refreshToken))
    return res.sendStatus(403).json(Response(STATUS_FAIL, 'Access Denied'))
  return jwt.verify(refreshToken, REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403).json(Response(STATUS_FAIL, 'Refresh Token Invalid'))
    const accessToken = generateAccessToken(user.username)
    return res.json(Response(STATUS_SUCCESS, 'Refresh Token Success', { accessToken }))
  })
}

// use this route to verify
exports.AuthRoute = async (req, res) => {
  res.json(
    Response(STATUS_SUCCESS, 'Token is verified', {
      username: req.user,
    })
  )
}
