/**
 * HTTP Response Template
 * @param {String} status
 * @param {String} message
 * @param {Array} data
 */
exports.Response = async (status, message, data) => ({
  status,
  message,
  data,
})
