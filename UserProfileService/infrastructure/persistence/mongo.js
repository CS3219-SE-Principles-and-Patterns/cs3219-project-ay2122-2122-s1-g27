const mongoose = require('mongoose')

const config = require('../../configs').development
const userEntity = require('../../domain/entities/user-entity')
const matchEntity = require('../../domain/entities/match-entity')

/**
 * (OUT PORT)
 * Layer that communicates directly with the Database
 */

const constructMongoDBURI = (dbConfig) => {
  if (
    'DB_USER' in dbConfig &&
    'DB_PASSWORD' in dbConfig &&
    'DB_HOST' in dbConfig &&
    'DB_PORT' in dbConfig &&
    'DB_NAME' in dbConfig
  ) {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = dbConfig
    if (dbConfig.DB_USER === '' || dbConfig.DB_PASSWORD === '') {
      // no need permisions
      console.log('Running without permissions')
      return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    }
    console.log('Running with permissions')
    return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
  }
  console.log('Warning, using default MongoDB URI')
  return 'mongodb://localhost:27017/UserProfileDB'
}

const dbURI = constructMongoDBURI(config.db)
console.log('Using MongoDB URI:', dbURI)

const db = {} // object containing 'conn',

if (dbURI) {
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
  })
  const conn = mongoose.connection
  if (conn) {
    console.log('MongoDB Connected Successfully')
    const userSchema = new mongoose.Schema(userEntity)
    db.users = mongoose.model('users', userSchema, 'users')
    const matchSchema = new mongoose.Schema(matchEntity, { timestamps: true })
    db.match = mongoose.model('match', matchSchema, 'match')

    module.exports = db
  } else {
    console.log('Error connecting MongoDB')
  }
} else {
  console.log('No DB Config Found')
}
