const questionsRepo = require('../../infrastructure/repository')
/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

/*
Accesses a question in the database based on its title and returns this question.
*/
exports.FindQuestion = async (req) => {
  try {
    const data = req.body

    const currentTitleExists = await questionsRepo.findOne({ title: data.title })
    if (!currentTitleExists) {
      throw new Error('No such question exists')
    }

    const currentQuestion = currentTitleExists
    console.log(currentQuestion)
    return currentQuestion
  } catch (err) {
    console.log('Error while accessing DB for finding single question', err)
    return { err }
  }
}

/*
Adds a question to the database, where duplicates based on the title should not exist, and returns this added Question.
*/
exports.AddQuestion = async (req) => {
  try {
    const data = req.body

    const currentTitleExists = await questionsRepo.findOne({ title: data.title })
    if (currentTitleExists) {
      throw new Error('A question with the specified title already exists')
    }

    const question = await questionsRepo.createOne({
      title: data.title,
      difficulty: data.difficulty,
      topic: data.topic,
      questionBody: data.questionBody,
      answer: data.answer,
    })

    question.save((err) => {
      if (err) {
        throw new Error('Save to database failed')
      }
    })
    console.log(question)

    return question
  } catch (err) {
    console.log('Error while accessing DB for adding single question', err)
    return { err: err.message }
  }
}

/*
Deletes a specific question in the database, based on the title, and returns this deleted Question.
*/
exports.DeleteQuestion = async (req) => {
  try {
    const data = req.body

    const currentTitleExists = await questionsRepo.findOne({ title: data.title })
    if (!currentTitleExists) {
      throw new Error('A question with the specified title does not exist')
    }

    // only allow one question of the same title to exist
    await questionsRepo.deleteMany({
      title: data.title,
    })

    console.log(currentTitleExists)

    return currentTitleExists
  } catch (err) {
    console.log('Error while accessing DB for deleting single question', err)
    return { err }
  }
}

/*
Finds all questions in the database
*/
exports.FindAllQuestions = async () => {
  try {
    return questionsRepo.findAll()
  } catch (err) {
    console.log('Error while accessing DB for getting all questions', err)
    return { err }
  }
}
