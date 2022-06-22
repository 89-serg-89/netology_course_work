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
    return advertisementModel.find(searchParams)
  }

  static findById (id) {
    return advertisementModel.findById(id)
  }
}

module.exports = Advertisement
