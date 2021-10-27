const _ = require('lodash')

/**
 * Map Data Structures to keep track of state and metadata
 */

const awaitingMatches = {} // username --> (socketID, topics, difficulties)
const matchingSocketIDsToUsername = {} // socketID --> username

// ------- Functions ----------
const addMatchingUser = async (username, socketID, topics, difficulties) => {
  awaitingMatches[username] = {
    socketID,
    topics,
    difficulties,
  }
  matchingSocketIDsToUsername[socketID] = username
  console.log('Currently awaiting match', awaitingMatches)
}

const removeUserFromMatching = (socketID) => {
  const username = matchingSocketIDsToUsername[socketID]
  console.log(`Removing SocketID: ${socketID} | Username: ${username}`)

  delete awaitingMatches[username]
  delete matchingSocketIDsToUsername[socketID]
  console.log('Currently awaiting match', awaitingMatches)
}

const triggerMatch = (triggerUsername, matchedUsername, commonTopics, commonDifficulties) => {
  //
}

const searchMatchingUser = (userDetailsQueue, username, topics, difficulties) => {
  //   eslint-disable-next-line no-restricted-syntax
  for (const tuple of userDetailsQueue) {
    // tuple: [username, (socketID, topics, difficulties)]
    const [otherUsername, otherUserData] = tuple
    const commonTopics = _.intersection(topics, otherUserData.topics)
    const commonDifficulties = _.intersection(difficulties, otherUserData.difficulties)
    console.log(`commonTopics`, commonTopics)
    console.log(`commonDifficulties`, commonDifficulties)
    if (commonTopics.length !== 0 && commonDifficulties.length !== 0) {
      console.log(`Match found between ${username} and ${tuple[0]}`)
      triggerMatch(username, otherUsername, commonTopics, commonDifficulties)
    }
  }
}

const MatchHandler = (socket, io) => {
  socket.on('match', (username, topics, difficulties) => {
    if (username === undefined || !Array.isArray(topics) || !Array.isArray(difficulties)) {
      return socket.emit('match', 'Bad Request')
    }
    if (!username) {
      console.warn('User attempting to match without being online')
      return socket.emit('match', 'Not online')
    }
    console.log(
      `Attempting to match user-${username} of: \ntopics-[${topics}]\ndifficulties-[${difficulties}]`
    )

    // clone and get Array of [username, ()]
    const awaitingMatchesQueue = Object.entries(JSON.parse(JSON.stringify(awaitingMatches)))
    if (awaitingMatchesQueue.length === 0) {
      // add and wait for future matches
      console.log('No one else to match with')
      addMatchingUser(username, socket.id, topics, difficulties)
      return socket.emit('match', 'Waiting to Match')
    }

    // try to match with existing pending users
    if (searchMatchingUser(awaitingMatchesQueue, username, topics, difficulties)) {
      console.log('Match is successful')
    }

    // if cannot match with anyone, insert into awaitingMatches as well
    return addMatchingUser(username, socket.id, topics, difficulties)
  })
}

module.exports = {
  MatchHandler,
}
