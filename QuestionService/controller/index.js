const { Router } = require('express')
const QuestionService = require('../application/service/question-service')

const routes = Router()

// Routes
routes.get('/', (_, res) => res.send('Welcome to the QuestionService. Do you have any questions?'))

routes.put('/question', QuestionService.FindQuestion)
routes.post('/question', QuestionService.AddQuestion)
routes.delete('/question', QuestionService.DeleteQuestion)

routes.get('/question/all', QuestionService.FindAllQuestions)
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
