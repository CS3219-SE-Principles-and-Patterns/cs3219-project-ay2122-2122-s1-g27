require('dotenv').config()

const ENV = process.env.ENV || 'development'
const {
  PORT,
  REDIS_LOCAL_HOSTNAME,
  REDIS_LOCAL_PORT,
  REDIS_LOCAL_PW,
  REDIS_REMOTE_HOSTNAME,
  REDIS_REMOTE_PORT,
  REDIS_REMOTE_PW,
} = process.env

console.log('Printing Environment Variables')
console.log('ENV', ENV)
console.log('PORT', PORT)
console.log('Redis Remote Hostname', REDIS_REMOTE_HOSTNAME)
console.log('Redis Remote Port', REDIS_REMOTE_PORT)

const configs = {
  development: {
    PORT: PORT || 7000,
    redisHost: REDIS_LOCAL_HOSTNAME || 'localhost',
    redisPort: REDIS_LOCAL_PORT || 6379,
    redisPw: REDIS_LOCAL_PW || '',
  },
  production: {
    PORT: PORT || 7000,
    redisHost: REDIS_REMOTE_HOSTNAME,
    redisPort: REDIS_REMOTE_PORT,
    redisPw: REDIS_REMOTE_PW,
  },
}

module.exports = configs[ENV]
