const { Router } = require('express')

const UserService = require('../application/service/user-service')
const AuthService = require('../application/service/auth-service')
const MatchService = require('../application/service/match-service')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Hello World with Express'))
routes.post('/user/create', UserService.CreateUser)
routes.post('/user/login', AuthService.LoginUser)
routes.get('/user/auth', AuthService.AuthRoute)
routes.post('/user/token', AuthService.RefreshToken)

// TEMP: For Testing Purposes only
routes.get('/match/find/:username', MatchService.FindUserMatched)
routes.post('/match/create', MatchService.CreateMatch)
routes.delete('/match/delete', MatchService.DeleteMatch)
routes.post('/match/find', MatchService.FindMatch)
routes.delete('/match/delete-expired', MatchService.DeleteExpiredMatches)
// ---

/**
 * Set the router of the Express Server
 * @param {express} app
 */
const routers = (app) => {
  app.use('/', routes).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
  })
}

module.exports = routers
