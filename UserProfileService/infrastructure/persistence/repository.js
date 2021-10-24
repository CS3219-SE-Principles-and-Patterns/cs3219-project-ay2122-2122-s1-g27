const db = require('./mongo')

// Repository for questions (hidden from exports)

const usersDB = db.users

// Functions for repository interactions and transactions

const findOne = async (condition) => usersDB.findOne(condition)

const createOne = async (params) => usersDB(params)

module.exports = { findOne, createOne }
