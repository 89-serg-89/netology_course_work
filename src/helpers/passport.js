const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const usersModule = require('../modules/user')
const getHash = require('./crypto')

/**
 * @param {String} email
 * @param {String} pass
 * @param {Function} done
 */
const verify = async (email, pass, done) => {
  try {
    const user = await usersModule.findByEmail(email)
    if (!user) return done(null, false)
    if (user.password !== getHash(pass)) return done(null, false)
    return done(null, user)
  } catch (e) {
    return done(e)
  }
}

const options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false,
}

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).send({
      error: 'Необходимо авторизоваться',
      status: "error"
    })
  }
  next()
}

const auth = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      if (req.originalUrl.indexOf('/api') > -1) {
        res.status(400)
        return res.send({
          error: 'Неверный логин или пароль',
          status: "error"
        })
      } else {
        return res.redirect('/login?error=Не верные данные для входа')
      }
    }

    // НУЖНО ВЫЗВАТЬ req.login()!!!
    req.login(user, next)
  })(req, res, next)
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify))

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser((user, cb) => {
  cb(null, user._id?.toString())
})

passport.deserializeUser( async (id, cb) => {
  try {
    const user = await usersModule.findById(id)
    if (!user) return cb(null, false)
    cb(null, user)
  } catch (e) {
    console.log(e)
    return cb(e)
  }
})

module.exports = {
  isAuthenticated,
  auth,
  passport
}
