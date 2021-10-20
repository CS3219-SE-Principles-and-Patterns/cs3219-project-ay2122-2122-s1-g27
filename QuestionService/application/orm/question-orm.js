const questionsRepo = require('../../infrastructure/persistence/repository')
/**
 * ORM only defines the calls to the DB Layer to CRUD data
 */

/*
Accesses a question in the database based on its title and returns this question.
*/
exports.FindQuestion = async (req) => {
  try {
    const data = req.body // alternatively, can use req.query

    if (!data.id) {
      throw new Error('Request has no id attribute')
    }

    const filter = { id: data.id }
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
//     const data = req.body.allQuestions

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
