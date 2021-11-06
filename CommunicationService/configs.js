require('dotenv').config()

const ENV = process.env.ENV || 'development'
const { PORT } = process.env

console.log('Printing Environment Variables')
console.log('ENV', ENV)
console.log('PORT', PORT)
const configs = {
  development: {
    PORT: PORT || 7000,
  },
  production: {
    PORT: PORT || 7000,
  },
}

module.exports = configs[ENV]
