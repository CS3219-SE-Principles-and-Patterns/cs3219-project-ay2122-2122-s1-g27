require('dotenv').config()

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_DOCKER_PORT } = process.env

console.log(`DB_USER`, DB_USER)
console.log(`DB_PASSWORD`, DB_PASSWORD)
console.log(`DB_HOST`, DB_HOST)
console.log(`DB_PORT`, DB_PORT)
console.log(`DB_NAME`, DB_NAME)
console.log(`NODE_DOCKER_PORT`, NODE_DOCKER_PORT)

const configs = {
  development: {
    PORT: NODE_DOCKER_PORT || 8080,
    db: {
      DB_USER: DB_USER || '',
      DB_PASSWORD: DB_PASSWORD || '',
      DB_HOST: DB_HOST || 'localhost',
      DB_PORT: DB_PORT || '27017',
      DB_NAME: DB_NAME || 'UserProfileDB',
    },
  },
  production: {
    PORT: NODE_DOCKER_PORT || 8080,
    db: {
      DB_USER: DB_USER || '',
      DB_PASSWORD: DB_PASSWORD || '',
      DB_HOST: DB_HOST || 'localhost',
      DB_PORT: DB_PORT || '27017',
      DB_NAME: DB_NAME || 'UserProfileDB',
    },
  },
}

module.exports = configs
