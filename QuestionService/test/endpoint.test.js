const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const app = require('../server')
const Questions = require('../infrastructure/persistence/mongo').questions
const Rooms = require('../infrastructure/persistence/mongo').rooms

const { URI } = require('../configs').development.db
const {
  VerifySuccess,
  VerifyFailure,
  getQuestionFindResult,
  checkIfCreateRoomFail,
  checkIfCreateRoomSuccess,
  loadDummyQuestionData,
} = require('./utils.test')

chai.should()
chai.use(chaiHttp)

describe('Endpoint Testing', () => {
  beforeEach(async () => {
    // clear DB
    await Questions.deleteMany({})
    await Rooms.deleteMany({})
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

  it('Able to get all questions via GET /question/all', async () => {
    const getAllQuestionsResultEmpty = await chai.request(app).get('/question/all')
    VerifySuccess(getAllQuestionsResultEmpty, 200)
    getAllQuestionsResultEmpty.body.should.be.a('object')
    getAllQuestionsResultEmpty.body.data.should.be.a('array')
    getAllQuestionsResultEmpty.body.data.length.should.eql(0)

    loadDummyQuestionData()
    const getAllQuestionsResult = await chai.request(app).get('/question/all')
    VerifySuccess(getAllQuestionsResult, 200)

    getAllQuestionsResult.body.should.be.a('object')
    getAllQuestionsResult.body.data.should.be.a('array')
    getAllQuestionsResult.body.data.length.should.eql(10)

    const resultDataElement = getAllQuestionsResult.body.data[0]
    resultDataElement.should.have.property('id')
    resultDataElement.should.have.property('title')
    resultDataElement.should.have.property('difficulty')
    resultDataElement.should.have.property('topic')
    resultDataElement.should.have.property('questionBody')
    resultDataElement.should.have.property('source')
    resultDataElement.should.have.property('answer')
    resultDataElement.should.have.property('sampleCases')
    resultDataElement.should.have.property('constraints')
  })

  it('Able to get question metadata via GET /question/metadata', async () => {
    const getMetadataResult = await chai.request(app).get('/question/metadata')

    console.log(getMetadataResult)
    getMetadataResult.should.have.status(200)

    getMetadataResult.body.should.be.a('object')
    const getMetadataResultBody = getMetadataResult.body
    getMetadataResultBody.should.have.property('DIFFICULTIES')
    getMetadataResultBody.should.have.property('TOPICS')
    getMetadataResultBody.DIFFICULTIES.should.be.a('object')
    Object.keys(getMetadataResultBody.DIFFICULTIES).length.should.eql(3)
    getMetadataResultBody.DIFFICULTIES.should.have.property('EASY')
    getMetadataResultBody.DIFFICULTIES.should.have.property('MEDIUM')
    getMetadataResultBody.DIFFICULTIES.should.have.property('HARD')

    getMetadataResultBody.TOPICS.should.be.a('object')
    Object.keys(getMetadataResultBody.TOPICS).length.should.eql(7)
    getMetadataResultBody.TOPICS.should.have.property('ARRAYS')
    getMetadataResultBody.TOPICS.should.have.property('LINKED_LISTS')
    getMetadataResultBody.TOPICS.should.have.property('BINARY_TREE')
    getMetadataResultBody.TOPICS.should.have.property('RECURSION')
    getMetadataResultBody.TOPICS.should.have.property('HASHING')
    getMetadataResultBody.TOPICS.should.have.property('TRAVERSAL')
    getMetadataResultBody.TOPICS.should.have.property('HEAPS')
  })

  it('Able to get specific question via GET /question/id/:id', async () => {
    const question1ResultBeforePopulate = await getQuestionFindResult(1)
    VerifyFailure(question1ResultBeforePopulate, 404)

    loadDummyQuestionData()

    const invalidQuestionResult = await getQuestionFindResult(-1)
    VerifyFailure(invalidQuestionResult, 404)

    const question1Result = await getQuestionFindResult(1)
    VerifySuccess(question1Result, 200)

    const question1ResultBody = question1Result.body
    question1ResultBody.message.should.eql('Found Question')

    const question1Data = question1Result.body.data
    question1Data.id.should.eql(1)
    question1Data.title.should.eql('Merge Sorted Array')
    question1Data.difficulty.should.eql('Easy')
    question1Data.topic.should.eql('Arrays')

    question1Data.questionBody.length.should.eql(3)
    question1Data.questionBody[0].should.eql(
      'You are given two integer arrays nums1 and nums2,' +
        ' sorted in non-decreasing order, and two integers m and n,' +
        ' representing the number of elements in nums1 and nums2 respectively.'
    )
    question1Data.questionBody[1].should.eql(
      'Merge nums1 and nums2 into a single array sorted in non-decreasing order.'
    )
    question1Data.questionBody[2].should.eql(
      'The final sorted array should not be returned by the function,' +
        ' but instead be stored inside the array nums1. To accommodate this,' +
        ' nums1 has a length of m + n, where the first m elements denote the' +
        ' elements that should be merged, and the last n elements are set to 0' +
        ' and should be ignored. nums2 has a length of n.'
    )

    question1Data.source.should.eql('https://leetcode.com/problems/merge-sorted-array')
    question1Data.answer.should.eql(
      'https://leetcode.com/problems/merge-sorted-array/discuss/?currentPage=1&orderBy=hot&query='
    )

    question1Data.sampleCases.length.should.eql(3)
    question1Data.sampleCases[0].input.should.eql(
      'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3'
    )
    question1Data.sampleCases[0].output.should.eql('[1,2,2,3,5,6]')
    question1Data.sampleCases[1].input.should.eql('nums1 = [1], m = 1, nums2 = [], n = 0')
    question1Data.sampleCases[1].output.should.eql('[1]')
    question1Data.sampleCases[2].input.should.eql('nums1 = [0], m = 0, nums2 = [1], n = 1')
    question1Data.sampleCases[2].output.should.eql('[1]')

    question1Data.constraints.length.should.eql(5)
    question1Data.constraints[0].should.eql('nums1.length == m + n')
    question1Data.constraints[1].should.eql('nums2.length == n')
    question1Data.constraints[2].should.eql('0 <= m, n <= 200')
    question1Data.constraints[3].should.eql('1 <= m + n <= 200')
    question1Data.constraints[4].should.eql('-109 <= nums1[i], nums2[j] <= 109')
  })

  it('Able to create room-question mapping for specific matching options via POST /question/room', async () => {
    loadDummyQuestionData()

    // valid positive test case
    const matchRequestData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: ['Arrays'],
      difficulties: ['Easy', 'Medium', 'Difficult'],
    }
    const getRoomIdResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(matchRequestData)

    VerifySuccess(getRoomIdResult, 200)
    const getRoomIdResultBody = getRoomIdResult.body
    checkIfCreateRoomSuccess(getRoomIdResultBody)

    // invalid topics
    const invalidMatchRequestTopicsData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: ['How to become a professional Judo player'],
      difficulties: ['Easy', 'Medium', 'Difficult'],
    }
    const invalidMatchRequestTopicsDataResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(invalidMatchRequestTopicsData)

    VerifyFailure(invalidMatchRequestTopicsDataResult, 404)
    const invalidTopicsBody = invalidMatchRequestTopicsDataResult.body
    checkIfCreateRoomFail(invalidTopicsBody)

    // invalid difficulties
    const invalidMatchRequestDifficultiesData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: ['Arrays'],
      difficulties: ['EasyDifficult'],
    }
    const invalidMatchRequestDifficultiesDataResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(invalidMatchRequestDifficultiesData)

    VerifyFailure(invalidMatchRequestDifficultiesDataResult, 404)
    const invalidDifficultiesBody = invalidMatchRequestDifficultiesDataResult.body
    checkIfCreateRoomFail(invalidDifficultiesBody)

    // empty topics
    const emptyMatchRequestTopicsData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: [],
      difficulties: ['Easy', 'Medium', 'Difficult'],
    }
    const emptyMatchRequestTopicsDataResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(emptyMatchRequestTopicsData)

    VerifyFailure(emptyMatchRequestTopicsDataResult, 404)
    const emptyTopicsBody = emptyMatchRequestTopicsDataResult.body
    checkIfCreateRoomFail(emptyTopicsBody)

    // empty difficulties
    const emptyMatchRequestDifficultiesData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: ['Arrays'],
      difficulties: [],
    }
    const emptyMatchRequestDifficultiesDataResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(emptyMatchRequestDifficultiesData)

    VerifyFailure(emptyMatchRequestDifficultiesDataResult, 404)
    const emptyDifficultiesBody = emptyMatchRequestDifficultiesDataResult.body
    checkIfCreateRoomFail(emptyDifficultiesBody)
  })

  it('Able to obtain question from room-question mapping given roomId via GET /question/room', async () => {
    loadDummyQuestionData()

    // creation of room
    const matchRequestData = {
      username1: 'firebreathingeugene',
      username2: 'waterbreathingeugene',
      topics: ['Arrays'],
      difficulties: ['Easy', 'Medium', 'Difficult'],
    }
    const getRoomIdResult = await chai
      .request(app)
      .post('/question/room')
      .set('content-type', 'application/json')
      .send(matchRequestData)

    VerifySuccess(getRoomIdResult, 200)
    const getRoomIdResultBody = getRoomIdResult.body
    checkIfCreateRoomSuccess(getRoomIdResultBody)

    // use mapping to get valid result
    const roomId = getRoomIdResultBody.data
    const getRoomQuestionData = { roomId }
    const getRoomMatchedQuestionResult = await chai
      .request(app)
      .get('/question/room')
      .set('content-type', 'application/json')
      .send(getRoomQuestionData)

    VerifySuccess(getRoomMatchedQuestionResult, 200)
    const getRoomMatchedQuestionBody = getRoomMatchedQuestionResult.body
    getRoomMatchedQuestionBody.status.should.eql('success')
    getRoomMatchedQuestionBody.message.should.eql('Found Room')
    getRoomMatchedQuestionBody.data.should.be.a('object')
    getRoomMatchedQuestionBody.data.roomId.should.eql(roomId)
    getRoomMatchedQuestionBody.data.question.id.should.be.oneOf([1, 2, 5, 7, 9])

    // try to access via an invalid room id (e.g. hacker)
    const invalidRoomQuestionData = { roomId: `${roomId}extraCodeHere` }
    const invalidRoomMatchedQuestionResult = await chai
      .request(app)
      .get('/question/room')
      .set('content-type', 'application/json')
      .send(invalidRoomQuestionData)

    VerifyFailure(invalidRoomMatchedQuestionResult, 404)
    const invalidRoomMatchedQuestionBody = invalidRoomMatchedQuestionResult.body
    invalidRoomMatchedQuestionBody.status.should.eql('fail')
    invalidRoomMatchedQuestionBody.message.should.eql('Cannot Find Room')
    invalidRoomMatchedQuestionBody.data.should.be.a('object')
    invalidRoomMatchedQuestionBody.data.should.have.property('err')
  })
})
