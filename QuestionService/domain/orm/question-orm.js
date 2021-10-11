const db = require('../repositories/mongo')

const Question = db.questions()

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */
exports.FindQuestion = async (req) => {
  try {
    // access db.questions repo to perform specific search
    // assumes title is unique and hence behaves like a pri key
    return db.questions.findOne({
      title: req.body.title,
    })

    // return {
    //   title: 'lol',
    //   difficulty: 'Easy',
    //   topic: 'Arrays',
    //   questionBody: 'hello?',
    //   answer: 'ans',
    // }
  } catch (err) {
    console.log('Error, cannot find question with said title', err)
    return { err }
  }
}

exports.AddQuestion = async (req) => {
  try {
    const data = req.body

    // const currentTitleExists = db.questions.findOne({ title: data.title })
    // if (currentTitleExists) {
    //   throw new Error('A question with the specified title already exists')
    // }

    const question = new Question({
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
    console.log('Add Question Failed: ', err)
    return { err }
  }
}

exports.DeleteQuestion = async (req) => {
  try {
    const data = req.body

    Question.deleteOne(
      {
        title: data.title,
      },
      (err) => {
        if (err) {
          throw new Error('Save to database failed')
        }
      }
    )

    const questionData = {
      title: data.title,
      difficulty: data.difficulty,
      topic: data.topic,
      questionBody: data.questionBody,
      answer: data.answer,
    }
    const question = new Question(questionData)

    return question
  } catch (err) {
    console.log('Delete Question Failed: ', err)
    return { err }
  }
}
