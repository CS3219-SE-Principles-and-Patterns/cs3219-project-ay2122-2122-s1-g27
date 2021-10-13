/*
The Controller contains all routes for a specific service.

The handlers (Application Layer) for each route of their respective service is found in the service (e.g. question-service.js) file.
These coordinate the calling functions of the ORM (Domain Layer) to execute the business logic of the Domain Layer.

The ORM (Domain Layer) contains all the business logic (that are related to the problem that the service wants to solve).
Note that for our case, we have the Entities (Entity Layer) and Repositories (Repository Layer) (e.g. both defined in the question-entity.js). Both are loosely defined as "DB Layer".
These are used both by the Infrastructure Layer via Mongoose (e.g. mongo.js) to set up the database during integration/setup inside mongo.js.
The Domain Layer is kept as agnostic as possible from the Infrastructure Layer (e.g. mongo.js which connects our used database references to external provider Mongoose).
In the Domain Layer, we have code/logic and contracts/interfaces/structures that performs operations to suit specific functionality for the given domain.

The Infrastructure Layer (defined in mongo.js) serves to connect our service to/integrate with external provider Mongoose for database functions.
Since this needs to know our Domain Layer's objects/structures and its interfaces/contracts, there is a dependency inversion. 
This layer connects our repositories to a Database provider (Mongoose; infrastructure) so that we can use their functions (e.g. APIs).

Therefore, this is a service that uses the Hexagonal Architecture.
*/
const { Router } = require('express')
const QuestionService = require('../application/question-service')

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
