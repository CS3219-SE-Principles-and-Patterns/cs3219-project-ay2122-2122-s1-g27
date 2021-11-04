/* eslint-disable no-await-in-loop */
const axios = require('axios')
const _ = require('lodash')

const ormMatch = require('../orm/match-orm')
const { MATCH_TIMEOUT_MS, CREATE_ROOM_ENDPOINT } = require('../util/constants')

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
        if (currDate - userMatch.updatedAt >= MATCH_TIMEOUT_MS) {
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

const getRoomID = async (matcherUsername, matchedUsername, topics, difficulties) => {
  try {
    const res = await axios.post(CREATE_ROOM_ENDPOINT, {
      username1: matcherUsername,
      username2: matchedUsername,
      topics,
      difficulties,
    })
    if (res.status === 200) {
      const roomID = res.data.data
      return roomID
    } else {
      console.error(`Could not get RoomID. HTTP Status: ${res.status}`)
      return null
    }
  } catch (err) {
    console.error(`Get RoomID Error: ${err}`)
    return null
  }
}

const createPendingMatch = (socket, topics, difficulties) => {
  const { username } = socket
  const createMatch = ormMatch.CreateMatch(username, socket.id, topics, difficulties)
  if (createMatch.err) {
    console.error('createMatch error', createMatch.err)
    return socket.emit('matchFail', 'ServerError')
  }
  if (createMatch) {
    console.log('Successful match creation, now waiting')
    socket.emit('match', 'waiting')
    return setTimeout(() => checkMatchStatus(socket, username), MATCH_TIMEOUT_MS)
  } else {
    console.log('Match Fail, could not createMatch')
    return socket.emit('matchFail', 'ServerError')
  }
}

/**
 * Loop through all possible matches, attempt match
 * @param {[match]} possibleMatches
 * @param {[string]} matcherTopics
 * @param {[string]} matcherDifficulties
 */
const handlePossibleMatches = async (
  possibleMatches,
  matcherTopics,
  matcherDifficulties,
  socket,
  io
) => {
  const matcherUsername = socket.username
  const matchStack = possibleMatches.reverse()
  let successful = false
  while (matchStack.length > 0) {
    const currMatch = matchStack.pop()
    console.log('Current matched', currMatch)
    const matchedUsername = currMatch.username
    const matchedSocketID = currMatch.socketID
    // find intersection
    const intersectingTopics = _.intersection(currMatch.topics, matcherTopics)
    const intersectingDifficulties = _.intersection(currMatch.difficulties, matcherDifficulties)
    console.log(
      `Intersecting - [Difficulties]: ${intersectingDifficulties} | [Topics]: ${intersectingTopics}`
    )
    const roomID = await getRoomID(
      matcherUsername,
      matchedUsername,
      intersectingTopics,
      intersectingDifficulties
    )
    if (roomID == null) {
      console.error(`RoomID generation encountered error`) // continue, try next
    } else {
      const clearMatched = await ormMatch.RemoveMatch(matchedUsername)
      if (clearMatched.err) {
        console.error(`Deleting User-${matchedUsername} encountered error`)
      }
      socket.emit('matchSuccess', roomID, matchedUsername) // emit to initator
      io.to(matchedSocketID).emit('matchSuccess', roomID, matcherUsername) // emit to matched
      successful = true
      break
    }
  }
  if (!successful) {
    console.warn(`User: ${matcherUsername} Unsuccessful in finding a match, triggering wait`)
    createPendingMatch(socket, matcherTopics, matcherDifficulties)
  }
}

const MatchHandler = (socket, io) => {
  socket.on('match', async (topics, difficulties) => {
    const { username } = socket // from auth middleware
    if (!Array.isArray(topics) || !Array.isArray(difficulties)) {
      return socket.emit('match', 'Bad Request')
    }
    // Arguments Valid
    console.log(`User: ${username} is triggering a match`)

    // Step1: Get a list of valid matches
    const possibleMatches = await ormMatch.FindMatches(
      topics,
      difficulties,
      username,
      MATCH_TIMEOUT_MS
    )
    console.log('Possible matches', possibleMatches)
    if (possibleMatches.err) {
      console.error('Possible matches error', possibleMatches.err)
      return socket.emit('matchFail', 'ServerError')
    }
    // Step2: Check if list of matches contain > 0 users. If no, go to Step2a. If yes, go to Step2b
    if (possibleMatches.length === 0) {
      // Step2a: Create a Match and persist in DB. Set timeout of 30s to find possible matching
      // Upon timeout, if username still exist in DB (meaning not matched), will inform user that
      // no matches were found, and delete entry from DB (warning: check for EXACT object equality)
      console.log('No possible match as of now')
      return createPendingMatch(socket, topics, difficulties)
    } else {
      // Step2b: Find a random user from list of matches
      // Query QuestionService to generate and get unique room ID. Emit RoomID to both clients
      // Additionally, delete the matched user from the QuestionService (so it wont get matched with someone else)
      return handlePossibleMatches(possibleMatches, topics, difficulties, socket, io)
    }
  })
}

module.exports = {
  MatchHandler,
}
