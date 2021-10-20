const db = require('./mongo')

// Repository for questions (hidden from exports)

const questionsDb = db.questions

// Functions for repository interactions and transactions

const findOne = async (condition) => questionsDb.findOne(condition)

const findAll = async () => questionsDb.find({})

module.exports = { findOne, findAll, questionsDb }

/* Methods for extensibility: Allow users in the future to add / delete own questions

const createOne = async (params) => questionsDb(params)
const deleteMany = async (params) => questionsDb.deleteMany(params)
*/
