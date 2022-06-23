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

messageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

module.exports = model('Message', messageSchema)
