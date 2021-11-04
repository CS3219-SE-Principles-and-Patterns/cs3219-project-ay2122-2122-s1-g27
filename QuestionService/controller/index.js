const { Router } = require('express')
const QuestionService = require('../application/service/question-service')
const RoomService = require('../application/service/room-service')
const { AuthenticateToken } = require('./auth')

const routes = Router()

// Routes
routes.get('/', (_, res) => res.send('Welcome to the QuestionService. Do you have any questions?'))

// questions
routes.get('/question/id/:id', QuestionService.FindQuestionById)
routes.get('/question/all', QuestionService.FindAllQuestions)
routes.get('/question/metadata', QuestionService.GetQuestionMetadata)

// matching for rooms
routes.post('/question/room', RoomService.CreateRoom)
routes.get('/question/room/:roomId', AuthenticateToken, RoomService.FindRoomById)
routes.delete('/question/room/:roomId', AuthenticateToken, RoomService.DeleteRoom)
routes.get(
  '/question/room/username/:username',
  AuthenticateToken,
  RoomService.GetCurrentRoomByUsername
)

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
