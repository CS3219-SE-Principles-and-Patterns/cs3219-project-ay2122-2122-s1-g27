const db = require('../repositories/mongo')

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

exports.UserExists = async (username) => {
  try {
    const user = await db.users.findOne({
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
    const user = db.users({
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

// exports.LoginUser = async (username, password) => {
//   try {
//     const user = db.users
//   } catch (err) {}
// }
