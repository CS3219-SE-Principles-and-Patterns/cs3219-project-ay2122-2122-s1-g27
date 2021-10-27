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

/**
 * Upsert a Match. Done when no matches could be found
 * @param {object} params Contains username (string), socketID (string), topics ([string]), difficulties ([string])
 */
const upsertUserMatch = (params) => {
  const { username } = params
  return matchDB.findOneAndUpdate({ username }, params, { upsert: true }, (err) => {
    if (err) throw err
  })
}

/**
 * Delete a Match. Used when either timeout (no match) OR
 * @param {*} params Contains username (string)
 */
const removeUserMatch = async (params) => matchDB.deleteOne(params)

/**
 * Find all possible matches for a particular user. Will filter out current user's username
 * @param {[string]} topics
 * @param {[string]} difficulties
 * @param {string} username
 * @returns
 */
const findMatches = async (topics, difficulties, username) =>
  matchDB.find({
    username: { $ne: username },
    topics: { $in: topics },
    difficulties: { $in: difficulties },
  })

module.exports = {
  findOneUser,
  createOneUser,
  findOneAndUpdateUser,
  upsertUserMatch,
  removeUserMatch,
  findMatches,
}
