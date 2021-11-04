const db = require('./mongo')

// Repositories and functions for repository interactions and transactions

// Question

const questionsDb = db.questions

const findOne = async (condition) => questionsDb.findOne(condition)

const findMatch = async (filter) =>
  questionsDb.find({
    $and: [{ topic: { $in: filter.topics } }, { difficulty: { $in: filter.difficulties } }],
  })

const findAll = async () => questionsDb.find({})

// Consolidate database storage apis

module.exports = { findOne, findAll, findMatch, questionsDb }

/* Methods for extensibility: Allow users in the future to add / delete own questions

const createOne = async (params) => questionsDb(params)
const deleteMany = async (params) => questionsDb.deleteMany(params)
*/
