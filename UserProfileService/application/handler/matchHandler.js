const _ = require('lodash')
const ormMatch = require('../orm/match-orm')

const TIMEOUT = 10000 // ms

const checkMatchStatus = async (socket, username) => {
  const userMatch = await ormMatch.FindUserMatched(username)
  // if null: have been matched by someone else and already removed. Already received success message
  if (userMatch != null) {
    console.log('Match still present in DB', userMatch)
    try {
      if (userMatch.err) {
        throw new Error(`FindUserMatchError: ${userMatch.err}`)
      } else {
        // Check if really 30 seconds elapsed, as user may have upserted (initiated new match)
        const currDate = new Date(Date.now())
        if (currDate - userMatch.updatedAt >= TIMEOUT) {
          // expired
          console.log('Evicting Expired Match: ', username)
          ormMatch.RemoveMatch(username)
          socket.emit('matchFail', 'Expired')
        } else {
          console.log(`Not expired yet: CurrDate: ${currDate} | UserDate: ${userMatch.updatedAt}`)
        }
      }
    } catch (err) {
      console.error(`Encountered err while checking user match status`, err)
      socket.emit('matchFail', 'Expired')
    }
  }
}

/**
 * From the list of possible matches (ordered by datetime, ascending)
 * Return the match
 * @param {[match]} possibleMatches
 *
 * @return {match} Match Object (see match-entity.js)
 */
const getMatch = (possibleMatches) => {
  const matched = _.sample(possibleMatches) // match object (See: match-entity.js)
  console.log('matched', matched)
  return matched
}

const MatchHandler = (socket, io) => {
  socket.on('match', async (username, topics, difficulties) => {
    if (typeof username !== 'string' || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return socket.emit('match', 'Bad Request')
    }
    // Arguments Valid

    // Step1: Get a list of valid matches
    const possibleMatches = await ormMatch.FindMatches(topics, difficulties, username, TIMEOUT)

    // Step2: Check if list of matches contain > 0 users. If no, go to Step2a. If yes, go to Step2b
    if (possibleMatches.length === 0) {
      // Step2a: Create a Match and persist in DB. Set timeout of 30s to find possible matching
      // Upon timeout, if username still exist in DB (meaning not matched), will inform user that
      // no matches were found, and delete entry from DB (warning: check for EXACT object equality)
      console.log('No possible match as of now')
      const createMatch = ormMatch.CreateMatch(username, socket.id, topics, difficulties)
      if (createMatch) {
        console.log('Successful match creation, now waiting')
        socket.emit('match', 'waiting')
        return setTimeout(() => checkMatchStatus(socket, username), TIMEOUT)
      } else {
        console.log('Match Fail, could not createMatch')
        return socket.emit('matchFail', 'ServerError')
      }
    }

    // Step2b: Find a random user from list of matches
    // Query QuestionService to generate and get unique room ID. Emit RoomID to both clients
    // Additionally, delete the matched user from the QuestionService (so it wont get matched with someone else)
    const matched = getMatch(possibleMatches)
    const matchedUsername = matched.username
    const matchedSocketID = matched.socketID
    const clearMatched = ormMatch.RemoveMatch(matchedUsername)
    if (clearMatched.err) {
      console.error(`Deleting User-${matchedUsername} encountered error`)
      return socket.emit('matchFail', 'failed')
    }
    const dummyRoomID = 'some-room'
    socket.emit('matchSuccess', dummyRoomID, matchedUsername) // emit to initator
    return io.to(matchedSocketID).emit('matchSuccess', dummyRoomID, matchedUsername) // emit to matched
  })
}

module.exports = {
  MatchHandler,
}
