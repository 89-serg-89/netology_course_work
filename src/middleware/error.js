module.exports = (err, req, res, next) => {
  console.log('Error: ', err)
  res.status(500)
  res.json({
    error: err.toString()
  })
}
