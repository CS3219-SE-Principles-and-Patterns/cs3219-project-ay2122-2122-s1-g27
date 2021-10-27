const repo = require('../../infrastructure/persistence/repository')

/**
 * Create a Match Entry
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
    console.log('Error, cannot remove match', err)
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
    console.log('res', res)
    return res
  } catch (err) {
    console.log('Cannot find match', err)
    return { err }
  }
}
