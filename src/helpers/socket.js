const { Server } = require('socket.io')
let roomName
let socket

const connect = (server) => {
  const io = new Server(server)
  io.on('connection', socketIO => {
    socket = socketIO
    roomName = socket.handshake.query.roomName
    console.log(`Socket roomName: ${roomName}`)
    socket.join(roomName)
    socket.on('message', onMessage)
  })
}

const onMessage = async (msg) => {
  msg.type = `room: ${roomName}`
  socket.to(roomName).emit('message', msg)
  socket.emit('message', msg)
}

module.exports = connect
