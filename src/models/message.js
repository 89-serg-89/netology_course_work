const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require: true
  },
  sentAt: {
    type: Date,
    default: Date.now,
    require: true
  },
  text: {
    type: String,
    require: true
  },
  readAt: {
    type: Date
  }
})

module.exports = model('Message', messageSchema)
