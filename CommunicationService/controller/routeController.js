const { Router } = require('express')

const routes = Router()

routes.get('/', (_, res) => {
  res.send('Hello World from Communication Service')
})

const routers = (app) => {
  app.use('/api/comm', routes).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
  })
}

module.exports = routers
