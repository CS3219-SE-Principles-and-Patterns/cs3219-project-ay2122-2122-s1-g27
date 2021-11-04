const chai = require('chai')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../util/enums')

chai.should()

exports.VerifySuccess = (res, expectedCode) => {
  res.should.have.status(expectedCode)
  res.body.status.should.equal(STATUS_SUCCESS)
}

exports.VerifyFailure = (res, expectedCode) => {
  res.should.have.status(expectedCode)
  res.body.status.should.equal(STATUS_FAIL)
}

exports.Snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
