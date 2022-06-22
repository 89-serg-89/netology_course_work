const { Schema, model } = require('mongoose')

const advertisementSchema = new Schema({
  shortTitle: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  images: {
    type: [String]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    require: true
  },
  tags: {
    type: [String]
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = model('Advertisement', advertisementSchema)
