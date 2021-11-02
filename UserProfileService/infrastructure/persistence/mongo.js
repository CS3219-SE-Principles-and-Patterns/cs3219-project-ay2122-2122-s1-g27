require('dotenv').config()
const mongoose = require('mongoose')

const ENV = process.env.ENV || 'development'
console.log(`Running in ${ENV} mode`)
const config = require('../../configs')[ENV] // select development || production
const userEntity = require('../../domain/entities/user-entity')
const matchEntity = require('../../domain/entities/match-entity')

const constructMongoDBURI = (dbConfig) => {
  if (ENV === 'development') {
    if (
      'DB_USER' in dbConfig &&
      'DB_PASSWORD' in dbConfig &&
      'DB_HOST' in dbConfig &&
      'DB_PORT' in dbConfig &&
      'DB_NAME' in dbConfig
    ) {
      const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = dbConfig
      if (dbConfig.DB_USER === '' || dbConfig.DB_PASSWORD === '') {
        // no need permisions, typically for local
        console.log('Running without permissions')
        return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
      }
      console.log('Running with permissions')
      return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
    }
    console.log('Warning, using default MongoDB URI')
    return 'mongodb://localhost:27017/UserProfileDB'
  } else {
    // production
    return dbConfig.URI
  }
}

const dbURI = constructMongoDBURI(config.db)

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
