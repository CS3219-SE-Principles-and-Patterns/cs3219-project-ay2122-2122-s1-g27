require('dotenv').config()

const ENV = process.env.ENV || 'development'
const { PORT, QUESTION_SERVICE_LOCAL_URL, QUESTION_SERVICE_DEPLOYED_URL } = process.env

console.log('Printing Environment Variables')
console.log('ENV', ENV)
console.log('PORT', PORT)
console.log(`QUESTION_SERVICE_LOCAL_URL`, QUESTION_SERVICE_LOCAL_URL)
console.log(`QUESTION_SERVICE_DEPLOYED_URL`, QUESTION_SERVICE_DEPLOYED_URL)

const configs = {
  development: {
    PORT: PORT || 5005,
    questionServiceURL: QUESTION_SERVICE_LOCAL_URL || 'http://localhost:8081',
  },
  production: {
    PORT: PORT || 5005,
    questionServiceURL: QUESTION_SERVICE_DEPLOYED_URL || 'http://localhost:8081',
  },
}

module.exports = configs[ENV]
