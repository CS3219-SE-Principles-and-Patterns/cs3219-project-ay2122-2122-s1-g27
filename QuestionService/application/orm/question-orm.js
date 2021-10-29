const questionsRepo = require('../../infrastructure/persistence/question-repository')
const { getRandomNumberBetweenInclMinExclMax } = require('../util/utilities')

// to filter questions for matching
const FindMatchedQuestionUtility = async (topics, difficulties) => {
  const filter = { topics, difficulties }
  const results = await questionsRepo.findMatch(filter)
  if (!results || results.length === 0) {
    throw new Error('No such question id exists')
  }

  const randomIndex = getRandomNumberBetweenInclMinExclMax(0, results.length)
  const randomResult = results[randomIndex]

  return randomResult
}

exports.FindMatchedQuestionUtility = FindMatchedQuestionUtility

/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

/*
Accesses a question in the database based on its id and returns this question.
Note the current approach uses GET request's req.query; alternatively, can use req.body if a POST request.
*/
exports.FindQuestion = async (questionID) => {
  try {
    if (!questionID) {
      throw new Error('Request has no id attribute')
    }

    const filter = { id: questionID }
    const currentTitleExists = await questionsRepo.findOne(filter)
    if (!currentTitleExists) {
      throw new Error('No such question id exists')
    }

    const currentQuestion = currentTitleExists
    return currentQuestion
  } catch (err) {
    console.log('Error in finding single question', err)
    return { err }
  }
}

/*
Accesses a question in the database which satisfy all filters in the request, with a random question chosen if multiple questions satisfy the filters.
*/
exports.FindMatchedQuestion = async (topics, difficulties) => {
  try {
    if (!topics || !difficulties) {
      throw new Error('Request is missing some attribute(s)')
    }

    const matchedQuestion = exports.FindMatchedQuestionUtility(topics, difficulties)

    return matchedQuestion
  } catch (err) {
    console.log('Error in finding single question', err)
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
    console.log('Error in getting all questions', err)
    return { err }
  }
}
// Methods for extensibility: Allow users in the future to add / delete own questions

// /*
// Adds a question to the database, where duplicates based on the title should not exist, and returns this added Question.
// */
// exports.AddQuestion = async (req) => {
//   try {
//     const data = req.body
//     if (
//       !data.id ||
//       !data.title ||
//       !data.difficulty ||
//       !data.topic ||
//       !data.questionBody ||
//       !data.answer
//     ) {
//       throw new Error('Request has missing required attribute(s)')
//     }
//     const filter = { id: data.id }
//     const currentTitleExists = await questionsRepo.findOne(filter)
//     if (currentTitleExists) {
//       throw new Error('A question with the specified id already exists')
//     }

//     const question = await questionsRepo.createOne({
//       id: data.id,
//       title: data.title,
//       difficulty: data.difficulty,
//       topic: data.topic,
//       questionBody: data.questionBody,
//       answer: data.answer,
//     })
//     question.save((err) => {
//       if (err) {
//         throw new Error('Save to database failed')
//       }
//     })

//     return question
//   } catch (err) {
//     console.log('Error in adding single question', err)
//     return { err: err.message }
//   }
// }

// exports.AddAllQuestions = async (req) => {
//   try {
//     const data = req.body.questionsData

//     const results = data.map(async (questionData) => {
//       if (
//         !questionData.id ||
//         !questionData.title ||
//         !questionData.difficulty ||
//         !questionData.topic ||
//         !questionData.questionBody ||
//         !questionData.answer
//       ) {
//         throw new Error('Request has missing required attribute(s)')
//       }
//       const filter = { id: data.id }
//       const currentTitleExists = await questionsRepo.findOne(filter)
//       if (currentTitleExists) {
//         throw new Error('A question with the specified id already exists')
//       }

//       const question = await questionsRepo.createOne({
//         id: questionData.id,
//         title: questionData.title,
//         difficulty: questionData.difficulty,
//         topic: questionData.topic,
//         questionBody: questionData.questionBody,
//         answer: questionData.answer,
//       })
//       question.save((err) => {
//         if (err) {
//           console.log(err)
//           throw new Error('Save to database failed')
//         }
//       })
//       return question
//     })

//     return results
//   } catch (err) {
//     console.log('Error in adding single question', err)
//     return { err: err.message }
//   }
// }

// /*
// Deletes a specific question in the database, based on the title, and returns this deleted Question.
// */
// exports.DeleteQuestion = async (req) => {
//   try {
//     const data = req.body
//     if (!data.id) {
//       throw new Error('Request has no id attribute')
//     }

//     const filter = { id: data.id }
//     const currentTitleExists = await questionsRepo.findOne(filter)
//     if (!currentTitleExists) {
//       throw new Error('A question with the specified id does not exist')
//     }

//     // only allow one question of the same title to exist
//     await questionsRepo.deleteMany(filter)

//     return currentTitleExists
//   } catch (err) {
//     console.log('Error while accessing DB for deleting single question', err)
//     return { err }
//   }
// }
