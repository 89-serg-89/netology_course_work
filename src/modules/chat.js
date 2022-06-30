const chatModel = require('../models/chat')
const messageModel = require('../models/message')
const EventEmitter = require('events');

class SendMsg extends EventEmitter {
  execute(func) {
    this.on('send-msg', data => {
      func(data)
    })
  }
}

const sendMsgEvent = new SendMsg()

class ChatModule {
  static find (users) {
    if (!users) return null
    const reverseUsers = [...users].reverse()
    return chatModel.findOne({ $or: [{ users }, { users: reverseUsers }]  })
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
    sendMsgEvent.emit('send-msg', {
      chatId: chat.id,
      author,
      receiver,
      message: message.text
    })
  }

  static subscribe (callback) {
    sendMsgEvent.execute(callback)
  }

  static getHistory (id) {
    return chatModel.findById(id)
  }
}

module.exports = ChatModule
