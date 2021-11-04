const { STATUS_FAIL } = require('../../util/enums')
const { Response } = require('../util/response')

exports.UnauthorizedError = (from, res) => {
  console.log(`From: ${from}, Attempting to view unauthorized resource`)
  const resp = Response(STATUS_FAIL, 'You are not authorized to view this resource')
  return res.status(403).json(resp)
}
