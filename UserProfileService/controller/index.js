const { Router } = require('express')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Hello World with Express'))

/**
 * Set the router of the Express Server
 * @param {express} app
 */
const routers = (app) => {
  app.use('/', routes).all((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
  })
}

module.exports = routers
