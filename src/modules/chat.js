const chatModel = require('../models/chat')

class ChatModule {
  static find (users) {
    if (!users) return null
  }

  static sendMessage (data) {

  }

  static subscribe () {

  }

  static getHistory (id) {
    return chatModel.findById(id)
  }
}

module.exports = ChatModule
