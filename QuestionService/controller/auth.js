require('dotenv').config()
const jwt = require('jsonwebtoken')

const { STATUS_FAIL } = require('../util/enums')
const { Response } = require('../application/util/response')

const { JWT_SECRET_TOKEN } = process.env

// Express Middleware for JWT Authentication
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
