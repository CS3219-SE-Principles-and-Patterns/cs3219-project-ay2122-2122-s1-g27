const mongoose = require('mongoose')
const config = require('../configs').development
const schema = require('../domain/question-entity')

/**
 * (OUT PORT)
 * Infrastructure Layer that communicates directly with the Database. Facilitates persistence.
 * This connects to database and then we export data representations into Repository which consists contracts for interaction.
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

    const questionSchema = new mongoose.Schema(schema)
    db.questions = mongoose.model('questions', questionSchema)

    module.exports = db
  } else {
    console.log('Error connecting MongoDB')
  }
} else {
  console.log('No DB Config Found')
}
