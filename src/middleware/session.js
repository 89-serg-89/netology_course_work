const session = require('express-session')
const MongoStore = require('connect-mongo')

let url = process.env.DB_HOST || 'mongodb://localhost:27017/'
if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
  url = url.split('//')
  url = `${url[0]}//${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${url[1]}`
}
const sessionMiddleware = session({
  store: MongoStore.create({
    mongoUrl: url,
    dbName: `${process.env.DB_NAME || 'advertisement'}-session`
  }),
  saveUninitialized: false,
  secret: 'netology course',
  resave: false,
})

module.exports = {
  session,
  sessionMiddleware
}
