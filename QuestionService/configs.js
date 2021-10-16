const configs = {
  development: {
    PORT: 8081,
    db: {
      URI: 'mongodb://localhost:27017/QuestionDB',
    },
  },
  production: {
    PORT: 8081,
    db: {
      URI: 'mongodb://localhost:27017/QuestionDB', // update later
    },
  },
}

module.exports = configs
