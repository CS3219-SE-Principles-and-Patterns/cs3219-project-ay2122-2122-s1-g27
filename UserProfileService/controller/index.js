const { Router } = require('express')

const UserService = require('../domain/service/user-service')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Hello World with Express'))
routes.post('/user/create', UserService.CreateUser)
routes.post('/user/login', UserService.LoginUser)
routes.get('/user/auth', UserService.AuthRoute)

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
