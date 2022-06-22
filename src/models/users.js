const { Schema, model } = require('mongoose')

const usersSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  }
})

usersSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

module.exports = model('Users', usersSchema)
