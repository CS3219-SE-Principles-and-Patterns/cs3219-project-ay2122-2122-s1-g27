/**
 * Entity Layer - Used by Repository Layer
 * Defines and models Schema of the MongoDB Table
 * @param {Mongoose} db
 */

const schema = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  topics: {
    // Arrays, Linked Lists, Binary Tree, Recursion, Hashing, Traversal, Heaps
    type: [String],
  },
  difficulties: {
    // Easy, Medium, Hard
    type: [String],
  },
}

module.exports = schema
