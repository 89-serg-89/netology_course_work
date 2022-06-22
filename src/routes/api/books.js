const path = require('path')
const express = require('express')
const router = express.Router()
const fileMiddleware = require('../../middleware/file')
const BookModel = require('../../models/book')

router.get('/', async (req, res) => {
  try {
    const data = await BookModel.find()
    res.json(data)
  } catch (e) {
    throw new Error(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id)
    if (!book) {
      res.status(404)
      res.json('book not found')
      return
    }
    res.json(book)
  } catch (e) {
    throw new Error(e)
  }
})

router.post(
  '/',
  fileMiddleware.fields([
    {
      name: 'fileCover', maxCount: 1
    },
    {
      name: 'fileBook', maxCount: 1
    }
  ]),
  async (req, res) => {
  try {
    let { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body
    if (!fileCover && req?.file?.filename) fileCover = req?.file?.filename
    const book = new BookModel({title, description, authors, favorite, fileCover, fileName, fileBook})
    const result = await book.save()
    if (!result) {
      res.status(404)
      res.json('Error')
      return
    }
    res.json(book)
  } catch (e) {
    throw new Error(e)
  }
})

router.put(
  '/:id',
  fileMiddleware.fields([
    {
      name: 'fileCover', maxCount: 1
    },
    {
      name: 'fileBook', maxCount: 1
    }
  ]),
  async (req, res) => {
  try {
    const data = req.body
    if (!data.fileCover && req?.file?.filename) data.fileCover = req?.file?.filename
    data.favorite = !!data.favorite
    const result = await BookModel.findByIdAndUpdate(req.params.id, {
      ...req.body
    })
    if (!result) {
      res.status(404)
      res.json('Error')
      return
    }
    res.json('success')
  } catch (e) {
    throw new Error(e)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await BookModel.deleteOne({ _id: req.params.id })
    if (result?.deletedCount < 1) {
      res.status(404)
      res.json('book not found')
      return
    }
    res.json('ok')
  } catch (e) {
    throw new Error(e)
  }
})

router.get('/:id/download', async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id)
    if (!book) res.status(404).json('Book not found')
    const pathDir = path.join(__dirname, '..', 'public', 'books', 'files', book.fileBook)
    res.download(pathDir, book.fileBook, err => {
      res.status(404).end()
    })
  } catch (e) {
    throw new Error(e)
  }
})

module.exports = router
