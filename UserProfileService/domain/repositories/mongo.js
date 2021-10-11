const mongoose = require('mongoose')

const config = require('../../configs').development
const user = require('../entities/user-entity')

/**
 * (OUT PORT)
 * Layer that communicates directly with the Database
 */
const dbURI = config.db.URI
const db = {} // object containing 'conn',

if (dbURI) {
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
  })
  const conn = mongoose.connection
  if (conn) {
    console.log('MongoDB Connected Successfully')
    db.users = user(mongoose)
    module.exports = db
  } else {
    console.log('Error connecting MongoDB')
  }
} else {
  console.log('No DB Config Found')
}
