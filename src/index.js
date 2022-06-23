require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const { passport } = require('./helpers/passport')
const socketHelper = require('./helpers/socket')

const apiRouter = require('./routes/api')
const apiAdvertisementRouter = require('./routes/api/advertisement')

const app = express()
const server = http.createServer(app)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

const { sessionMiddleware } = require('./middleware/session')
const errorMiddleware = require('./middleware/error')

app.use(cookieParser())
app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

const io = socketHelper.socketIO(server, {
  cors: {
    origin: '*'
  }
})
const factoryMiddlewareSocket = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(factoryMiddlewareSocket(sessionMiddleware))
io.use(factoryMiddlewareSocket(passport.initialize()))
io.use(factoryMiddlewareSocket(passport.session()))
new socketHelper.Socket(io)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, '/public')))

// routes
app.use('/api', apiRouter)
app.use('/api/advertisements', apiAdvertisementRouter)

app.use(errorMiddleware)

const port = process.env.PORT || 3000
const init = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST || 'mongodb://localhost:27017/', {
      user: process.env.DB_USERNAME || '',
      pass: process.env.DB_PASSWORD || '',
      dbName: process.env.DB_NAME || 'advertisement',
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Соединение с БД успешно')

    server.listen(port, () => {
      console.log(`Library app listening on port ${port}`)
    })
  } catch ( e ) {
    console.warn(e.toString())
  }
}
init()
