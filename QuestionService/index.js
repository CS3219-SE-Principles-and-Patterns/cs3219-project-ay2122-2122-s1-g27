/*
- Server redirects to controller for routing, where controller defines all endpoints.
- These endpoints are found in application>service describe what order and which ORM functions are called.
- ORM is a port, and consists of functions which call other functions (that rely on external dependencies/libraries/microservices) 
which are contracted in Infrastructure>Repository. This keeps the endpoints in application>service as separated from the 
adapters as possible since this port is now a middleman/contract.

- Infrastructure (mongo) connects this our Repository to the external provider to allow us to use their APIs and functionalities.
- Repository represents Domain Objects (aggregates of ValueObjs/Entities) which we have defined in Domain, as well as contains 
the contracts on allowing the Domain Layer changes to be persisted. Repository actually lies on something called the 
Infrastructure-Persistence Layer.
*/

const server = require('./server')

const config = require('./configs').development
// use process.env later
const { PORT } = config

server.listen(PORT, () => {
  console.log(`QuestionService Server up on port ${PORT}`)
})

module.exports = server
