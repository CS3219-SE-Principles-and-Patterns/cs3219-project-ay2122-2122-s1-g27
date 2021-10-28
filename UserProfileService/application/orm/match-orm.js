const repo = require('../../infrastructure/persistence/repository')

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
 * @param {number} secondsBefore Entries before a certain time will be deleted
 * @returns
 */
exports.RemoveExpiredMatches = async (secondsBefore = 30) => {
  try {
    const currDate = new Date(Date.now() - secondsBefore * 1000)
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
 * Find all possible possible matches for a particular user, then randomly pick one to be matched
 * @param {[string]} topics
 * @param {[string]} difficulties
 * @param {string} username
 * @returns {[object]} match object in UserProfileDB.match
 */
exports.FindMatches = async (topics, difficulties, username) => {
  try {
    const res = await repo.findMatches(topics, difficulties, username)
    return res
  } catch (err) {
    console.log('Cannot find match', err)
    return { err }
  }
}
