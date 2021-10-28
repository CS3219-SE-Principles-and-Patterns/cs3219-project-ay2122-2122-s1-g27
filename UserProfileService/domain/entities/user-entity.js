/**
 * Entity Layer - Used by Repository Layer
 * Defines and models Schema of the MongoDB Table
 * @param {Mongoose} db
 */

module.exports = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}
