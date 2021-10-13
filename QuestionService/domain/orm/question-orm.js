const db = require('../repositories/mongo')

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

/*
Accesses a question in the database based on its title and returns this question.
*/
exports.FindQuestion = async (req) => {
  try {
    const data = req.body

    const currentTitleExists = await db.questions.findOne({ title: data.title })
    if (!currentTitleExists) {
      throw new Error('No such question exists')
    }

    const currentQuestion = currentTitleExists
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

    const currentTitleExists = await db.questions.findOne({ title: data.title })
    if (currentTitleExists) {
      throw new Error('A question with the specified title already exists')
    }

    const question = db.questions({
      title: data.title,
      difficulty: data.difficulty,
      topic: data.topic,
      questionBody: data.questionBody,
      answer: data.answer,
    })

    // save model to database
    question.save((err) => {
      if (err) {
        throw new Error('Save to database failed')
      }
    })

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

    const currentTitleExists = await db.questions.findOne({ title: data.title })
    if (!currentTitleExists) {
      throw new Error('A question with the specified title does not exist')
    }

    // only allow one question of the same title to exist
    await db.questions.deleteMany({
      title: data.title,
    })

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
    return db.questions.find({})
  } catch (err) {
    console.log('Error while accessing DB for getting all questions', err)
    return { err }
  }
}
