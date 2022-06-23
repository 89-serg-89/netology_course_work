const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../../helpers/passport')
const advertisementModule = require('../../modules/advertisement')
const fileMiddleware = require('../../middleware/file')

router.post('/', isAuthenticated, fileMiddleware.fields([
  {
    name: 'images', maxCount: 5
  }
]), async (req, res) => {
  try {
    const data = req.body
    data.user = req.user
    if (req.files?.images.length) {
      data.images = req.files.images.map(img => img.filename)
    }
    const result = await advertisementModule.create(data)
    data.id = result._id.toString()
    data.user = { id: data.user.id.toString(), name: data.user.name }
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

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const advertisement = await advertisementModule.findById(req.params.id)
      .populate('user', '_id')
    if (req.user._id.toString() !== advertisement.user._id.toString()) {
      res.status(403)
      return res.json({
        error: 'Нет прав на данное действие',
        status: 'error'
      })
    }
    await advertisementModule.remove(advertisement._id)
    res.json({
      status: 'ok'
    })
  } catch (e) {
    console.log('Error:', e)
    res.status(400)
    res.end()
  }
})

module.exports = router
