/**
 * HTTP Response Template
 * @param {String} status
 * @param {String} message
 * @param {Array} data
 */
const Response = async (status, message, data) => ({
  status,
  message,
  data,
})

const wrapResult = async (res, failMessage, successMessage, respOrm) => {
  if (!respOrm || respOrm.err) {
    const resp = await Response('fail', failMessage, respOrm)
    return res.status(404).json(resp)
  }
  const resp = await Response('success', successMessage, respOrm)
  return res.status(200).json(resp)
}

module.exports = {
  Response,
  wrapResult,
}
