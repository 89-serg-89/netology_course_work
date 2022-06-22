const path = require('path')
const fs = require('fs')
const constants = require('node:constants')
const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.access(path.join(__dirname, '..', '/public/imgs'), constants.F_OK, err => {
      if (err) {
        fs.mkdirSync(path.join(__dirname, '..', '/public/imgs'))
      }
      cb(null, path.join(__dirname, '..', '/public/imgs'))
    })
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
  }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'text/plain', 'application/pdf']

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage, fileFilter
})
