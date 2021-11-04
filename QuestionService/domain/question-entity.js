/**
 * Entities are used in Aggregates which then supposedly are modelled in/interacted with in Repositories.
 * This can be considered part of the Domain Layer
 * Defines and models Schema of the database table
 */

const schema = {
  id: {
    type: Number,
    required: true,
  },
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
    type: [String],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  sampleCases: {
    type: [{ input: String, output: String }],
    required: true,
  },
  constraints: {
    type: [String],
    required: true,
  },
}

module.exports = schema
