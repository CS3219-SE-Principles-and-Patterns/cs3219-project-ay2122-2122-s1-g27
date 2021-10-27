module.exports = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  socketID: {
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
  matchedWith: {
    // other username
    type: String,
  },
}
