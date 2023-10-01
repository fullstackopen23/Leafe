const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

const stripe = require('stripe')(process.env.STRIPE)

mongoose
  .connect(url)

  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

console.log('connecting to', url)

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.post('/api/create-checkout-session', async (req, res) => {
  console.log(req.body)
  const allowed_countries = ['DE', 'US']
  const session = await stripe.checkout.sessions.create({
    line_items: req.body.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries,
    },
    success_url: `${process.env.DEVURL}sucess`,
    cancel_url: `${process.env.DEVURL}/shoppingCart`,
  })
  return res.json({ session: session })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
