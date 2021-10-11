/**
 * Entity Layer - Used by Repository Layer
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
  return db.model('Question', questionSchema)
}
