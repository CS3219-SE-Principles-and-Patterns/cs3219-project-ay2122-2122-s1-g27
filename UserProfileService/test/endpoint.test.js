const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

// const app = require('../server')
const { URI } = require('../configs').development.db

chai.should()
chai.use(chaiHttp)

describe('Endpoint Testing', () => {
  // before each

  after(async () => {
    mongoose.disconnect()
  })

  it('should connect and disconnect to mongodb', async () => {
    mongoose.disconnect()
    mongoose.connection.on('disconnected', () => {
      mongoose.connection.readyState.should.equal(0)
    })
    mongoose.connection.on('connected', () => {
      mongoose.connection.readyState.should.equal(1)
    })
    mongoose.connection.on('error', () => {
      mongoose.connection.readyState.should.equal(99)
      // expect(mongoose.connection.readyState).to.equal(99)
    })

    await mongoose.connect(URI, {
      useNewUrlParser: true,
    })
  })
})
