const { METADATA } = require('../constants/constants')
const { Response, wrapResult } = require('../util/response')
const ormQuestion = require('../domain/question-orm')

/**
 * Application Layer (Service) defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 * These contain the function definition of the HTTP Routes
 */

const FindQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.FindQuestion(req)
    return await wrapResult(res, 'Cannot Find Question', 'Found Question', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const AddQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.AddQuestion(req)
    return await wrapResult(res, 'Cannot Add Question', 'Added Question', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const DeleteQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.DeleteQuestion(req)
    return await wrapResult(res, 'Cannot Delete Question', 'Deleted Question', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const FindAllQuestions = async (_, res) => {
  try {
    const respOrm = await ormQuestion.FindAllQuestions()
    return await wrapResult(res, 'Cannot Find All Questions', 'Found All Questions', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const GetQuestionMetadata = async (_, res) => res.status(200).json(METADATA)

module.exports = {
  FindQuestion,
  FindAllQuestions,
  AddQuestion,
  DeleteQuestion,
  GetQuestionMetadata,
}
