require('dotenv').config()

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_DOCKER_PORT, ATLAS_PASSWORD } =
  process.env

console.log(`Local DB_USER`, DB_USER)
console.log(`Local DB_PASSWORD`, DB_PASSWORD)
console.log(`Local DB_HOST`, DB_HOST)
console.log(`Local DB_PORT`, DB_PORT)
console.log(`Local DB_NAME`, DB_NAME)
console.log(`Local NODE_DOCKER_PORT`, NODE_DOCKER_PORT)

const configs = {
  development: {
    PORT: NODE_DOCKER_PORT || 8081,
    db: {
      DB_USER: DB_USER || '',
      DB_PASSWORD: DB_PASSWORD || '',
      DB_HOST: DB_HOST || 'localhost',
      DB_PORT: DB_PORT || '27017',
      DB_NAME: DB_NAME || 'QuestionDB',
      URI: 'mongodb://localhost:27017/QuestionDB', // for local testing
    },
  },
  production: {
    PORT: NODE_DOCKER_PORT || 8081,
    db: {
      URI: `mongodb+srv://cs3219:${ATLAS_PASSWORD}@cluster0.afp4g.mongodb.net/QuestionDB?retryWrites=true&w=majority`,
    },
  },
}

module.exports = configs
