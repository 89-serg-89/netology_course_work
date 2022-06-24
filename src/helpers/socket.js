const socketIO = require('socket.io')
const userModel = require('../modules/user')
const chatModel = require('../modules/chat')

class Socket {
  constructor (io) {
    this.io = io
    this.init()
  }

  init () {
    this.io.on('connection', this.onConnection.bind(this))
  }

  onConnection (socket) {
    this.socket = socket
    // console.log(socket.request.user)
    // if (!socket.request?.isAuthenticated()) return
    // roomName = socketIO.handshake.query.roomName
    // console.log(`Socket roomName: ${roomName}`)
    // socketIO.join(roomName)
    socket.on('isAuth', this.onIsAuth.bind(this))
    socket.on('getUsers', this.onUsers.bind(this))
    socket.on('getHistory', this.onHistory.bind(this))
    socket.on('sendMessage', this.onMessage.bind(this))

    setTimeout(() => {
      this.socket.emit('status', 'connect')
    }, 1000)
  }

  onIsAuth () {
    this.socket.emit('auth', `${this.socket.request?.isAuthenticated()}`)
  }

  onUsers = async () => {
    const res = await userModel.find({ _id: { $ne: this.socket.request.user.id } }).select('id name')
    this.socket.emit('users', res)
  }

  onHistory (msg) {
    console.log(msg)
  }

  onMessage = async (msg) => {
    // msg.type = `room: ${roomName}`
    // this.io.to(roomName).emit('message', msg)
    // this.socket.emit('message', msg)
    const receiver = await userModel.findById(msg.receiver)
    const data = {
      text: msg.text,
      receiver,
      author: this.socket.request.user
    }
    const res = await chatModel.sendMessage(data)
  }
}

module.exports = {
  socketIO,
  Socket
}
