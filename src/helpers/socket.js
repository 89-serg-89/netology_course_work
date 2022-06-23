const socketIO = require('socket.io')

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
    console.log(socket.request.user)
    // roomName = socketIO.handshake.query.roomName
    // console.log(`Socket roomName: ${roomName}`)
    // socketIO.join(roomName)
    socket.on('message', this.onMessage.bind(this))
  }

  onMessage (msg) {
    console.log(msg)
    // msg.type = `room: ${roomName}`
    // this.io.to(roomName).emit('message', msg)
    this.socket.emit('message', msg)
  }
}

// const connect = (socket) => {
//   // const socket = new io.Server(server, {
//   //   cors: {
//   //     origin: "*",
//   //     methods: ["GET", "POST"],
//   //     allowedHeaders: ["my-custom-header"],
//   //     credentials: true
//   //   }
//   // })
//   socket = io(server)
//   socket.on('connection', socketIO => {
//     console.log(socketIO.request.session)
//     // socket = socketIO
//     roomName = socketIO.handshake.query.roomName
//     console.log(`Socket roomName: ${roomName}`)
//     socketIO.join(roomName)
//     socketIO.on('message', onMessage)
//   })
// }
//
// const onMessage = async (msg) => {
//   console.log(msg)
//   msg.type = `room: ${roomName}`
//   socket.to(roomName).emit('message', msg)
//   socket.emit('message', msg)
// }

module.exports = {
  socketIO,
  Socket
}
