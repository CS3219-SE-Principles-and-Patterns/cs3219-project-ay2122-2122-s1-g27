exports.STATUS_SUCCESS = 'success'
exports.STATUS_FAIL = 'fail'

/**
 * HTTP Response Template
 * @param {String} status
 * @param {String} message
 * @param {Array} data
 */
exports.Response = (status, message, data = []) => ({
  status,
  message,
  data,
})

exports.WrapResult = async (res, failMessage, successMessage, respOrm) => {
  if (!respOrm || respOrm.err) {
    const resp = await this.Response(this.STATUS_FAIL, failMessage, respOrm)
    return res.status(404).json(resp)
  }
  const resp = await this.Response(this.STATUS_SUCCESS, successMessage, respOrm)
  return res.status(200).json(resp)
}

exports.UnauthorizedError = (from, res) => {
  console.log(`From: ${from}, Attempting to view unauthorized resource`)
  const resp = this.Response(this.STATUS_FAIL, 'You are not authorized to view this resource')
  return res.status(403).json(resp)
}
