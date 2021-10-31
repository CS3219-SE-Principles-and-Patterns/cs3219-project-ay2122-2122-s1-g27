const db = require('./mongo')

// Repositories and functions for repository interactions and transactions

// Room

const roomsDb = db.rooms

const findRoom = async (condition) => roomsDb.findOne(condition)

const deleteRoom = async (delFilter) => roomsDb.deleteMany(delFilter)

const createRoom = async (delFilter, params) =>
  roomsDb.findOneAndUpdate(delFilter, params, { upsert: true, returnOriginal: false })

// Consolidate database storage apis

module.exports = { findRoom, createRoom, deleteRoom, roomsDb }
