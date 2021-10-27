const db = require('./mongo')

// Repository for questions (hidden from exports)

const usersDB = db.users
const matchDB = db.match

// Functions for repository interactions and transactions

// UsersDB
const findOneUser = async (condition) => usersDB.findOne(condition)

const createOneUser = async (params) => usersDB(params)

const findOneAndUpdateUser = async (query, update) => usersDB.findOneAndUpdate(query, update)

// MatchDB
const upsertUserMatch = (params) => {
  const { username } = params
  return matchDB.findOneAndUpdate({ username }, params, { upsert: true }, (err) => {
    if (err) throw err
  })
}

const removeUserMatch = async (params) => matchDB.deleteOne(params)

// const findAllMatchingUsers = async

module.exports = {
  findOneUser,
  createOneUser,
  findOneAndUpdateUser,
  upsertUserMatch,
  removeUserMatch,
}
