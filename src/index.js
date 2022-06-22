require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const { passport } = require('./helpers/passport')
const socketConnect = require('./helpers/socket')

const apiRouter = require('./routes/api')
const apiAdvertisementRouter = require('./routes/api/advertisement')

const app = express()
const server = http.createServer(app)
socketConnect(server)

const errorMiddleware = require('./middleware/error')

let mongoClient

app.use(cookieParser())

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_HOST || 'mongodb://localhost:27017/',
      dbName: `${process.env.DB_NAME || 'advertisement'}-session`
    }),
    saveUninitialized: false,
    secret: 'netology course',
    resave: true,
    cookie: { secure: false }
  })
)

app.use(passport.initialize())
app.use(passport.session())

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
    mongoClient = await mongoose.connect(process.env.DB_HOST || 'mongodb://localhost:27017/', {
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
