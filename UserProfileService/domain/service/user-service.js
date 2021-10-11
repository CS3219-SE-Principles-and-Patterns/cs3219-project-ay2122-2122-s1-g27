const ormUser = require('../orm/user-orm')
const { Response } = require('../../util/response')

/**
 * Service Layer defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 */
// contain the function definition of the HTTP Routes
exports.FindUser = async (_, res) => {
  try {
    const respOrm = await ormUser.FindUser()
    if (!respOrm.err) {
      const resp = await Response('Success', 'Found User', respOrm)
      return res.status(200).json(resp)
    }
    const resp = await Response('Failure', 'Cannot Find User', respOrm)
    return res.status(404).json(resp)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}
