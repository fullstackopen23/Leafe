const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: Array,
  size: String,
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Product', productSchema)
