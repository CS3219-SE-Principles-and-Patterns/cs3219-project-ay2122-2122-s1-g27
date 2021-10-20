const { Router } = require('express')
const QuestionService = require('../application/service/question-service')

const routes = Router()

// Routes
routes.get('/', (_, res) => res.send('Welcome to the QuestionService. Do you have any questions?'))

// read
routes.post('/question/', QuestionService.FindQuestionById)
routes.get('/question/all', QuestionService.FindAllQuestions)
routes.post('/question/match', QuestionService.FindMatchedQuestion)
routes.get('/question/metadata', QuestionService.GetQuestionMetadata)

/* 
Below are all admin methods; feel free to delete and use mongoDB admin; 
However, can possibly allow users to upload also using the ones below, albeit needing some additional checks/concurrency settings

// create
routes.post('/question/create', QuestionService.AddQuestion)
routes.post('/question/createMany', QuestionService.AddAllQuestions)
// delete
routes.delete('/question/', QuestionService.DeleteQuestion)
*/

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
