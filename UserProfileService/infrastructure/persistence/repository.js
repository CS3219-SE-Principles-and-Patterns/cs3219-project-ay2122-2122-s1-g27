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
 * Find the match object for a particular user
 * @param {string} username
 * @returns {match}
 */
const findUserMatch = (username) => matchDB.findOne({ username })

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

const removeMatchesBeforeDateTime = async (date) =>
  matchDB.deleteMany({
    updatedAt: { $lte: date },
  })

/**
 * Find all possible matches for a particular user. Will filter out current user's username and sort by updatedAt time
 * @param {[string]} topics
 * @param {[string]} difficulties
 * @param {string} username
 * @returns {[match]} Array of Match objects, sorted asc by `updatedAt`
 */
const findMatches = async (topics, difficulties, username) =>
  matchDB
    .find({
      username: { $ne: username },
      topics: { $in: topics },
      difficulties: { $in: difficulties },
    })
    .sort({ updatedAt: 1 })

module.exports = {
  findOneUser,
  createOneUser,
  findOneAndUpdateUser,
  findUserMatch,
  upsertUserMatch,
  removeUserMatch,
  removeMatchesBeforeDateTime,
  findMatches,
}
