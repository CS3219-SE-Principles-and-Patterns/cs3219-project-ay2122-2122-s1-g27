const { Router } = require('express')

const QuestionService = require('../domain/service/question-service')

const routes = Router()

// Controller will contain all the User-defined Routes
routes.get('/', (_, res) => res.send('Welcome to the QuestionService. Do you have any questions?'))

routes.get('/question', QuestionService.FindQuestion)
routes.post('/question', QuestionService.AddQuestion)
routes.delete('/question', QuestionService.DeleteQuestion)

routes.get('/question/metadata', QuestionService.GetQuestionMetadata)

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
