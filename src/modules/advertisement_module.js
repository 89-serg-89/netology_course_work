const advertisementModel = require('../models/advertisement')

class Advertisement {
  static create (data) {
    const advertisement = new advertisementModel(data)
    return advertisement.save()
  }

  static remove (id) {
    return advertisementModel.findByIdAndUpdate(id, { isDeleted: true })
  }

  static find (params) {
    const searchParams = {
      isDeleted: false
    }
    if (params.shortTitle) {
      searchParams.shortTitle = { $regex: params.shortTitle, $options: 'i' }
    }
    if (params.description) {
      searchParams.description = { $regex: params.description, $options: 'i' }
    }
    if (params.userId) {
      searchParams.user = params.userId
    }
    if (params.tags) {
      searchParams.tags = params.tags
    }
    return advertisementModel.find(searchParams)
  }

  static findById (id) {
    return advertisementModel.findById(id)
  }
}

module.exports = Advertisement
