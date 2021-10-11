const bcrypt = require('bcrypt')

const ormUser = require('../orm/user-orm')
const { Response } = require('../../util/response')
/**
 * Service Layer defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 */

const internalServerError = async (err, from, res) => {
  console.log(`From: ${from}, Error: ${err}`)
  const resp = await Response('Failure', 'DB Failure', [])
  return res.status(500).send(resp)
}

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
    return internalServerError(err, 'FindUser', res)
  }
}

exports.CreateUser = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const hashed = await bcrypt.hash(password, 10)
      const respOrm = await ormUser.CreateUser(username, hashed)
      if (!respOrm.err && respOrm) {
        // successfully created
        const resp = await Response('Success', 'Created User', [])
        return res.status(201).json(resp)
      }
      console.log('Cannot Create User: ', respOrm.err)
      const resp = await Response('Failure', 'Cannot Create User', [])
      return res.status(400).json(resp)
    }
    const resp = await Response('Failure', 'Missing Args', [])
    return res.status(400).json(resp)
  } catch (err) {
    return internalServerError(err, 'CreateUser', res)
  }
}
