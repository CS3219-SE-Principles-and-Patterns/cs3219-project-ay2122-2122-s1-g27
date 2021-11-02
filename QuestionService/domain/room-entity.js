/**
 * Entities are used in Aggregates which then supposedly are modelled in/interacted with in Repositories.
 * This can be considered part of the Domain Layer
 * Defines and models Schema of the database table
 */

const schema = {
  _id: false,
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  questionId: {
    type: Number,
    required: true,
  },
  usernames: {
    type: [String],
    required: true,
  },
}

module.exports = schema
