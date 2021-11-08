const { Router } = require('express')

const UserService = require('../application/service/user-service')
const AuthService = require('../application/service/auth-service')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Hello World from UserProfileService'))
routes.post('/create', UserService.CreateUser)
routes.post('/login', AuthService.LoginUser)
routes.get('/auth', AuthService.AuthenticateToken, AuthService.AuthRoute)
routes.post('/token', AuthService.RefreshToken)

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
