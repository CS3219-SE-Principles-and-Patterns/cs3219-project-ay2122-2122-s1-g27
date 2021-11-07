const { Router } = require('express')
const QuestionService = require('../application/service/question-service')
const RoomService = require('../application/service/room-service')
const { AuthenticateToken } = require('./auth')

const routes = Router()

// Routes
routes.get('/', (_, res) => res.send('Welcome to the QuestionService. Do you have any questions?'))

// questions
routes.get('/questions/id/:id', QuestionService.FindQuestionById)
routes.get('/questions/all', QuestionService.FindAllQuestions)
routes.get('/questions/metadata', QuestionService.GetQuestionMetadata)

// matching for rooms
routes.post('/room', RoomService.CreateRoom)
routes.get('/room/:roomId', AuthenticateToken, RoomService.FindRoomById)
routes.delete('/room/:roomId', AuthenticateToken, RoomService.DeleteRoom)
routes.get('/room/username/:username', AuthenticateToken, RoomService.GetCurrentRoomByUsername)

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
  app.use('/api/question', routes).all((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
  })
}

module.exports = routers
