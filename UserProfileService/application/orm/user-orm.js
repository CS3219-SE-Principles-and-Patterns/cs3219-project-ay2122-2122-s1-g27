const repo = require('../../infrastructure/persistence/repository')

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

exports.UserExists = async (username) => {
  try {
    const user = await repo.findOneUser({
      username,
    })
    if (user) return true
    return false
  } catch (err) {
    console.log('Error, cannot find user', err)
    return { err }
  }
}

exports.CreateUser = async (username, password) => {
  try {
    const user = await repo.createOneUser({
      username,
      password,
    })
    user.save()
    return true
  } catch (err) {
    console.log('Cannot create user', err)
    return { err }
  }
}

exports.FindUser = async (username) => {
  try {
    return repo.findOneUser({
      username,
    })
  } catch (err) {
    console.log('Error, cannot find user', err)
    return { err }
  }
}

exports.UpdatePreferences = async (username, topics, difficulties) => {
  try {
    return repo.findOneAndUpdateUser({ username }, { topics, difficulties })
  } catch (err) {
    console.log('Error, unable to update preferences', err)
    return { err }
  }
}
