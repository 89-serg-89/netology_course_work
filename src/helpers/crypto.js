const { createHmac } = require('node:crypto')

const secret = process.env.USER_PASS_SECRET || 'userpass'
const getHash = (pass) => {
  return createHmac('sha256', secret)
    .update(pass)
    .digest('hex')
}

module.exports = getHash
