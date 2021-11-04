const repo = require('../../infrastructure/persistence/repository')

/**
 * Query a Match Entry by providing a username.
 * @param {string} username
 * @returns {match}
 */
exports.FindUserMatched = (username) => {
  try {
    return repo.findUserMatch(username)
  } catch (err) {
    console.log('Error cannot find user match', err)
    return { err }
  }
}

/**
 * Create (Upsert) a Match Entry. Will delete the old entry
 * @param {string} username
 * @param {string} socketID
 * @param {string[]} topics
 * @param {string[]} difficulties
 * @returns
 */
exports.CreateMatch = (username, socketID, topics, difficulties) => {
  try {
    repo.upsertUserMatch({
      username,
      socketID,
      topics,
      difficulties,
    })
    return true
  } catch (err) {
    console.log('Error, cannot create match', err)
    return { err }
  }
}

/**
 * Deletes a Match entry from DB
 * @param {string} username
 * @returns
 */
exports.RemoveMatch = async (username) => {
  try {
    const res = await repo.removeUserMatch({ username }) // contain .deleteCount
    return res
  } catch (err) {
    console.error('Error, cannot remove match', err)
    return { err }
  }
}

/**
 * Removed expired entries from the DB
 * @param {number} msBefore Entries before a certain amt of milliseconds will be deleted
 * @returns
 */
exports.RemoveExpiredMatches = async (msBefore = 30000) => {
  try {
    const currDate = new Date(Date.now() - msBefore)
    const res = await repo.removeMatchesBeforeDateTime(currDate)
    if (res.acknowledged) {
      console.log(`Deleted ${res.deletedCount} expired matches`)
      return true
    }
    return false
  } catch (err) {
    console.error('Error cannot removed expired', err)
    return { err }
  }
}

/**
 * Find all possible matches (i.e. not expired) for a particular user, return ascending time
 * @param {[string]} topics
 * @param {[string]} difficulties
 * @param {string} username
 * @param {number} msBefore
 * @returns {[object]} match object in UserProfileDB.match
 */
exports.FindMatches = async (topics, difficulties, username, msBefore = 30000) => {
  try {
    const currDate = new Date(Date.now())
    const res = await repo.findMatches(topics, difficulties, username)
    const activeMatches = res.filter((match) => currDate - match.updatedAt < msBefore)
    return activeMatches
  } catch (err) {
    console.log('Cannot find match', err)
    return { err }
  }
}
