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
