const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const stripeRouter = require('./controllers/stripe')
const usersRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')
const path = require('path')

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log('connected to MongoDB', process.env.MONGODB_URI)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/create-checkout-session', stripeRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
