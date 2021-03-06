const express = require('express')
const router = express.Router()
const { auth, passport } = require('../../helpers/passport')
const userModule = require('../../modules/user')

router.get('/logout', (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err)
      res.json({
        status: 'ok'
      })
    })
  } catch (e) {
    console.log('Error:', e)
    res.status(400)
    res.end()
  }
})

router.post('/signup', async (req, res) => {
  try {
    const data = req.body
    const candidate = await userModule.findByEmail(data.email)
    if (candidate) {
      res.status(400)
      return res.json({
        error: 'email занят',
        status: 'error'
      })
    }
    await userModule.create(data)
    delete data.password
    res.status(201)
    res.json({
      data,
      status: 'ok'
    })
  } catch (e) {
    console.log('Error:', e)
    res.status(400)
    res.end()
  }
})

router.post('/signin', auth, async (req, res) => {
  try {
    const { id, email, name, contactPhone } = req.user
    res.status(200)
    res.json({
      data: { id, email, name, contactPhone },
      status: 'ok'
    })
  } catch (e) {
    console.log('Error:', e)
    res.status(400)
    res.end()
  }
})

router.get('/check-user', (req, res) => {
  res.json({
    user: req.user
  })
})

module.exports = router
