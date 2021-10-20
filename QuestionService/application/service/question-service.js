const { METADATA } = require('../constants/constants')
const { Response, wrapResult } = require('../util/response')
const ormQuestion = require('../orm/question-orm')

/**
 * Application Layer (Service) defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 * These contain the function definition of the HTTP Routes
 */

const FindQuestionById = async (req, res) => {
  try {
    const respOrm = await ormQuestion.FindQuestion(req)
    return await wrapResult(res, 'Cannot Find Question', 'Found Question', respOrm)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const FindMatchedQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.FindMatchedQuestion(req)
    return await wrapResult(res, 'Cannot Find Question for Match', 'Found Match Question', respOrm)
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
  FindQuestionById,
  FindAllQuestions,
  FindMatchedQuestion,
  GetQuestionMetadata,
}

/*
Methods for extensibility: Allow users in the future to add / delete own questions

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

const AddAllQuestions = async (req, res) => {
  try {
    const respOrm = await ormQuestion.AddAllQuestions(req)
    return await wrapResult(res, 'Cannot Add All Questions', 'Added All Question', respOrm)
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
*/
