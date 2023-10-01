const productsRouter = require('express').Router()
const Product = require('../models/product')
const products = require('../db')

productsRouter.get('/', (request, response) => {
  Product.find({}).then((products) => {
    response.json(products)
  })
})

productsRouter.get('/api/products/:id', (request, response) => {
  const id = Number(request.params.id)
  const product = products.find((p) => p.id === id)

  response.json(product)
})

productsRouter.delete('/', (request, response) => {
  Product.deleteMany({}).then((products) => {
    response.json(products)
  })
})

productsRouter.post('/', (request, response) => {
  console.log(products)
  products.forEach((product) => {
    const newProduct = new Product({
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
    })
    newProduct.save()
  })
  response.json(products)
})

module.exports = productsRouter
