const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const app = require('../server')
const db = require('../infrastructure/persistence/mongo')
const { URI } = require('../configs').development.db
const { USER_STUB } = require('./stubs')
const { VerifySuccess, VerifyFailure } = require('./utils')

chai.should()
chai.use(chaiHttp)

describe('Test MongoDB', () => {
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
})

describe('Endpoint Testing for HTTP Requests', () => {
  before(async () => {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
    })
  })
  beforeEach(async () => {
    // clear DB
    await db.users.deleteMany({})
  })
  after(async () => {
    mongoose.disconnect()
  })

  // test server working
  it('GET root `/`', async () => {
    const res = await chai.request(app).get('/')
    res.should.have.status(200)
    res.body.should.be.a('object')
  })

  it('Create User and Successfully Login, Prevent Login if wrong password', async () => {
    const createRes = await chai.request(app).post('/user/create').send(USER_STUB)
    VerifySuccess(createRes, 201)

    const loginRes = await chai.request(app).post('/user/login').send(USER_STUB)
    VerifySuccess(loginRes, 200)
    const loginResData = loginRes.body.data
    loginResData.should.be.an('object')
    loginResData.should.have.property('accessToken')
    loginResData.should.have.property('refreshToken')

    const wrongStub = { ...USER_STUB }
    wrongStub.password = '123'
    const wrongLoginRes = await chai.request(app).post('/user/login').send(wrongStub)
    VerifyFailure(wrongLoginRes, 401)
  })

  it('Prevent creation of username with > 1 word', async () => {
    const createRes = await chai.request(app).post('/user/create').send({
      username: 'Two words',
      password: 123,
    })
    VerifyFailure(createRes, 400)
  })

  it('Prevent creation of same username', async () => {
    const createRes = await chai.request(app).post('/user/create').send(USER_STUB)
    VerifySuccess(createRes, 201)

    const createRes2 = await chai.request(app).post('/user/create').send(USER_STUB)
    VerifyFailure(createRes2, 409)
  })

  it('Prevent creation of User object without username or password', async () => {
    const noUsername = await chai.request(app).post('/user/create').send({
      username: '123',
    })
    VerifyFailure(noUsername, 400)

    const noPassword = await chai.request(app).post('/user/create').send({
      password: '123',
    })
    VerifyFailure(noPassword, 400)
  })

  it('Test Auth', async () => {
    await chai.request(app).post('/user/create').send(USER_STUB)
    const loginRes = await chai.request(app).post('/user/login').send(USER_STUB)
    const { accessToken } = loginRes.body.data
    const authHeader = `Bearer ${accessToken}`

    const authRes = await chai.request(app).get('/user/auth').set('Authorization', authHeader)
    VerifySuccess(authRes, 200)

    const wrongAuthHeader = `Bearer ${accessToken.slice(0, -1)}`
    const authWrongRes = await chai
      .request(app)
      .get('/user/auth')
      .set('Authorization', wrongAuthHeader)
    VerifyFailure(authWrongRes, 403)
  })

  it('No Auth Header Fail', async () => {
    const authRes = await chai.request(app).get('/user/auth')
    VerifyFailure(authRes, 401)
  })
})
