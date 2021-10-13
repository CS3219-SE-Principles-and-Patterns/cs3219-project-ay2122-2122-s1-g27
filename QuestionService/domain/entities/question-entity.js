/**
 * Entities are used in Aggregates which then supposedly are modelled in Repositories.
 * This can be considered part of the Domain Layer
 * Defines and models Schema of the MongoDB Table
 * @param {Mongoose} db
 */
module.exports = (db) => {
  const questionSchema = new db.Schema({
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    questionBody: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  })
  return db.model('questions', questionSchema)
}
