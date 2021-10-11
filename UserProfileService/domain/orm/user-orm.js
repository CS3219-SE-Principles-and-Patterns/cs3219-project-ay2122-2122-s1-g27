const db = require('../repositories/mongo')

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

exports.FindUser = async () => {
  try {
    return db.users.findOne({
      username: 'DivineDX',
    })
  } catch (err) {
    console.log('Error, cannot find user', err)
    return { err }
  }
}
