const mongoose = require('mongoose')
const config = require('../../configs').development
const question = require('../entities/question-entity')

/**
 * (OUT PORT)
 * Infrastructure Layer that communicates directly with the Database.
 * Here. we connect to database and then export this db representation.
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
    db.questions = question(mongoose)
    module.exports = db
  } else {
    console.log('Error connecting MongoDB')
  }
} else {
  console.log('No DB Config Found')
}
