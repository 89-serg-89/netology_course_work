const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  try {
    res.render('index', {
      title: 'Главная'
    })
  } catch (e) {
    console.log(`Error: ${e}`)
    res.redirect('/404')
  }
})

module.exports = router
