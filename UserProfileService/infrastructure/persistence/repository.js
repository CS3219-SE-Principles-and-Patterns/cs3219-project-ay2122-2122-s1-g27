const db = require('./mongo')

// Repository for questions (hidden from exports)

const usersDB = db.users

// Functions for repository interactions and transactions

const findOne = async (condition) => usersDB.findOne(condition)

const createOne = async (params) => usersDB(params)

const findOneAndUpdate = async (query, update) => usersDB.findOneAndUpdate(query, update)

module.exports = { findOne, createOne, findOneAndUpdate }
