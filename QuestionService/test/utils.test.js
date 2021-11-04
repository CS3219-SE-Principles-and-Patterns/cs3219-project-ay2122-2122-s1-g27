const chai = require('chai')
const { STATUS_SUCCESS, STATUS_FAIL } = require('../util/enums')
const app = require('../server')

const dummyQuestionData = require('../data/dummy-questions.json')
const { questionsDb } = require('../infrastructure/persistence/question-repository')

chai.should()

exports.VerifySuccess = (res, expectedCode) => {
  res.should.have.status(expectedCode)
  res.body.status.should.equal(STATUS_SUCCESS)
}

exports.VerifyFailure = (res, expectedCode) => {
  res.should.have.status(expectedCode)
  res.body.status.should.equal(STATUS_FAIL)
}

exports.getQuestionFindResult = async (questionId) => {
  const questionFindUrl = `/question/id/${questionId}`
  const getAllQuestionsResult = await chai.request(app).get(questionFindUrl)
  return getAllQuestionsResult
}

exports.checkIfCreateRoomFail = (result) => {
  result.status.should.eql('fail')
  result.message.should.eql('Cannot Create Room')
  result.data.should.be.a('object')
  result.data.should.have.property('err')
}

exports.checkIfCreateRoomSuccess = (result) => {
  result.status.should.eql('success')
  result.message.should.eql('Room Created')
  result.data.should.be.a('string')
}

exports.loadDummyQuestionData = () => {
  const createOne = async (params) => questionsDb(params)
  const allDummyQuestions = dummyQuestionData.map(async (questionData) => {
    const question = await createOne({
      id: questionData.id,
      title: questionData.title,
      difficulty: questionData.difficulty,
      topic: questionData.topic,
      questionBody: questionData.questionBody,
      source: questionData.source,
      answer: questionData.answer,
      sampleCases: questionData.sampleCases,
      constraints: questionData.constraints,
    })
    question.save((err) => {
      if (err) {
        console.log(err)
        throw new Error('Save to database failed')
      }
    })
    return question
  })
  return allDummyQuestions
}
