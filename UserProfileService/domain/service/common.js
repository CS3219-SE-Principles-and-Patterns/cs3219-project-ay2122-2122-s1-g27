require('dotenv').config()
const { Response } = require('../../util/response')

const { STATUS_FAIL } = require('../../util/enums')

exports.JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN
exports.REFRESH_TOKEN = process.env.REFRESH_TOKEN

exports.InternalServerError = (err, from, res) => {
  console.log(`From: ${from}, Error: ${err}`)
  const resp = Response(STATUS_FAIL, 'DB Failure')
  return res.status(500).json(resp)
}

exports.MissingArgsError = (from, res) => {
  console.log(`From: ${from}`)
  const resp = Response(STATUS_FAIL, 'Missing HTTP Request Body Parameters')
  return res.status(400).json(resp)
}
