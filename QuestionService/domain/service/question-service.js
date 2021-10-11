const { METADATA } = require('../../constants/constants')

const ormQuestion = require('../orm/question-orm')
const { Response } = require('../../util/response')

/**
 * Service Layer defines the HTTP Route Handler Functions
 * All Functions defined here will have `req` and `res`
 */
// contain the function definition of the HTTP Routes
const FindQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.FindQuestion(req)
    if (!respOrm.err) {
      const resp = await Response('Success', 'Found Question', respOrm)
      return res.status(200).json(resp)
    }
    const resp = await Response('Failure', 'Cannot Find Question', respOrm)
    return res.status(404).json(resp)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const AddQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.AddQuestion(req)
    if (!respOrm.err) {
      const resp = await Response('Success', 'Added Question', respOrm)
      return res.status(200).json(resp)
    }
    const resp = await Response('Failure', 'Cannot Add Question', respOrm)
    return res.status(404).json(resp)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const DeleteQuestion = async (req, res) => {
  try {
    const respOrm = await ormQuestion.DeleteQuestion(req)
    if (!respOrm.err) {
      const resp = await Response('Success', 'Deleted Question', respOrm)
      return res.status(200).json(resp)
    }
    const resp = await Response('Failure', 'Cannot Delete Question', respOrm)
    return res.status(404).json(resp)
  } catch (err) {
    console.log('err: ', err)
    const resp = await Response('Failure', 'DB failed', [])
    return res.status(500).send(resp)
  }
}

const GetQuestionMetadata = async (_, res) => res.status(200).json(METADATA)

module.exports = { FindQuestion, AddQuestion, DeleteQuestion, GetQuestionMetadata }
