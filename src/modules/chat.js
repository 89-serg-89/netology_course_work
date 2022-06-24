const chatModel = require('../models/chat')
const messageModel = require('../models/message')

class ChatModule {
  static find (users) {
    if (!users) return null
    return chatModel.findOne({ users })
  }

  static async sendMessage (data) {
    const { author, receiver, text } = data
    const users = [author, receiver]
    let chat = await this.find(users)
    if (!chat) {
      chat = new chatModel({
        users,
        messages: []
      })
    }
    const message = new messageModel({
      author: author,
      text: text
    })
    chat.messages.push(message)
    await chat.save()
    await message.save()
  }

  static subscribe () {

  }

  static getHistory (id) {
    return chatModel.findById(id)
  }
}

module.exports = ChatModule
