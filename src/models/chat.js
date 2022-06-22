const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
  users: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      require: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    require: true
  },
  messages: {
    type: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    }],
  }
})

module.exports = model('Chat', chatSchema)
