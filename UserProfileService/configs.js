const configs = {
  development: {
    PORT: 8080,
    db: {
      URI: 'mongodb://localhost:27017/UserProfileDB',
    },
  },
  production: {
    PORT: 8080,
    db: {
      URI: 'mongodb://localhost:27017/UserProfileDB', // update later
    },
  },
}

module.exports = configs
