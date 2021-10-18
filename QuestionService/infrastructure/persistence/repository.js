const db = require('./mongo')

// Repository for questions (hidden from exports)

const questionsDb = db.questions

// Functions for repository interactions and transactions

const findOne = async (condition) => questionsDb.findOne(condition)

const findAll = async () => questionsDb.find({})

const createOne = async (params) => questionsDb(params)

const deleteMany = async (params) => questionsDb.deleteMany(params)

module.exports = { findOne, findAll, createOne, deleteMany, questionsDb }
