require('dotenv').config()

const {
  ENV,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  NODE_DOCKER_PORT,
  ATLAS_PASSWORD,
  QUESTION_SERVICE_LOCAL_URL,
} = process.env

console.log('Printing ENV variables')
console.log(`ENV`, ENV)
console.log(`Local DB_USER`, DB_USER)
console.log(`Local DB_PASSWORD`, DB_PASSWORD)
console.log(`Local DB_HOST`, DB_HOST)
console.log(`Local DB_PORT`, DB_PORT)
console.log(`Local DB_NAME`, DB_NAME)
console.log(`Local NODE_DOCKER_PORT`, NODE_DOCKER_PORT)
console.log(`Local QuestionService URL`, QUESTION_SERVICE_LOCAL_URL)

const configs = {
  development: {
    PORT: NODE_DOCKER_PORT || 8080,
    db: {
      DB_USER: DB_USER || '',
      DB_PASSWORD: DB_PASSWORD || '',
      DB_HOST: DB_HOST || 'localhost',
      DB_PORT: DB_PORT || '27017',
      DB_NAME: DB_NAME || 'UserProfileDB',
      URI: 'mongodb://localhost:27017/UserProfileDB', // for local testing
    },
    questionServiceURL: QUESTION_SERVICE_LOCAL_URL || 'http://localhost:8081',
  },
  production: {
    PORT: NODE_DOCKER_PORT || 8080,
    db: {
      URI: `mongodb+srv://cs3219:${ATLAS_PASSWORD}@cluster0.afp4g.mongodb.net/UserProfileDB?retryWrites=true&w=majority`,
    },
    questionServiceURL: QUESTION_SERVICE_LOCAL_URL,
  },
}

module.exports = configs
