const usersModel = require('../models/users')
const getHash = require('../helpers/crypto')

class UserModule {
  static create (data) {
    const user = new usersModel({
      ...data,
      password: getHash(data.password)
    })
    return user.save()
  }

  static findByEmail (email) {
    return usersModel.findOne({ email })
  }

  static findById (id) {
    return usersModel.findById(id)
  }
}

module.exports = UserModule
