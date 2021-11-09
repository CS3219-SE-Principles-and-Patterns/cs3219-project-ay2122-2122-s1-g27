const { Router } = require('express')
const axios = require('axios')
const UserService = require('../application/service/user-service')
const AuthService = require('../application/service/auth-service')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Hello World from UserProfileService'))
routes.post('/create', UserService.CreateUser)
routes.post('/login', AuthService.LoginUser)
routes.get('/auth', AuthService.AuthenticateToken, AuthService.AuthRoute)
routes.post('/token', AuthService.RefreshToken)

// TEMP: To debug and test service discovery
routes.post('/checkService', async (req, res) => {
  const { url } = req.body
  console.log(`Receiving checkService, url: ${url}`)
  try {
    const serviceRes = await axios.get(url)
    if (serviceRes.status === 200) {
      console.log('success', serviceRes)
      return res.status(200).json({
        message: 'Reachable',
        response: serviceRes.data,
      })
    } else {
      console.error('Error from status code not 200 OK', serviceRes)
      return res.status(404).json('Unreachable')
    }
  } catch (err) {
    const errJSON = err.toJSON()
    console.error('Error Thrown, Caught. JSON:', errJSON)
    return res.status(404).json({
      message: 'Unreachable',
      response: errJSON,
    })
  }
})

/**
 * Set the router of the Express Server
 * @param {express} app
 */
const routers = (app) => {
  app.use('/api/user', routes).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
  })
}

module.exports = routers
