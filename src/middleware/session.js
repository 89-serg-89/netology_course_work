const session = require('express-session')
const MongoStore = require('connect-mongo')

const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: process.env.DB_HOST || 'mongodb://localhost:27017/',
    dbName: `${process.env.DB_NAME || 'advertisement'}-session`
  }),
  saveUninitialized: false,
  secret: 'netology course',
  resave: true,
  cookie: { secure: false }
})

module.exports = {
  session,
  sessionMiddleware
}
