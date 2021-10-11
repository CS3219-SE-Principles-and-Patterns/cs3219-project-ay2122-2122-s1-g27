/**
 * Entity Layer - Used by Repository Layer
 * Defines and models Schema of the MongoDB Table
 * @param {Mongoose} db
 */
module.exports = (db) => {
  const userSchema = new db.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
  return db.model('users', userSchema)
}
