const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const app = require('../server')
const Questions = require('../infrastructure/persistence/mongo').questions
const { URI } = require('../configs').development.db

chai.should()
chai.use(chaiHttp)

describe('Endpoint Testing', () => {
  beforeEach(async () => {
    // clear DB
    await Questions.deleteMany({})
  })
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
    })

    await mongoose.connect(URI, {
      useNewUrlParser: true,
    })
  })

  // test server working
  it('GET root `/`', async () => {
    const res = await chai.request(app).get('/')
    res.should.have.status(200)
    res.body.should.be.a('object')
  })
})
