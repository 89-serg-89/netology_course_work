const socketIO = require('socket.io')
const userModule = require('../modules/user')
const chatModule = require('../modules/chat')

class Socket {
  constructor (io) {
    this.io = io
    this.init()
  }

  init () {
    this.io.on('connection', this.onConnection.bind(this))
  }

  onConnection (socket) {
    socket.on('isAuth', this.onIsAuth.bind(this, socket))
    socket.on('getUsers', this.onUsers.bind(this, socket))
    socket.on('getHistory', this.onHistory.bind(this, socket))
    socket.on('sendMessage', this.onMessage.bind(this, socket))

    chatModule.subscribe(async (data) => {
      if (socket.connected) {
        if (![data.author.id, data.receiver.id].includes(socket.request.user.id)) return
        socket.join(data.chatId)
        const msgSocket = {
          username: data.author.name,
          text: data.message
        }
        socket.emit('newMessage', msgSocket)
      }
    })
  }

  onIsAuth (socket) {
    socket.emit('auth', `${socket.request?.isAuthenticated()}`)
  }

  onUsers = async (socket) => {
    const res = await userModule.find({ _id: { $ne: socket.request.user?.id } }).select('id name')
    socket.emit('users', res)
  }

  onHistory = async (socket, msg) => {
    const receiver = await userModule.findById(msg.id)
    const chat = await chatModule.find([socket.request.user, receiver])
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
          model: 'Users',
          select: 'name'
        }
      })
    const messages = chat?.messages
    socket.emit('chatHistory', messages?.map(item => ({
      username: item.author.name,
      text: item.text
    })))
  }

  onMessage = async (socket, msg) => {
    const receiver = await userModule.findById(msg.receiver)
    const data = {
      text: msg.text,
      receiver,
      author: socket.request.user
    }
    await chatModule.sendMessage(data)
  }
}

module.exports = {
  socketIO,
  Socket
}
