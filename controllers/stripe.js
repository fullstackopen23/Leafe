const stripeRouter = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE)

stripeRouter.post('/', async (req, res) => {
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
    success_url: `${process.env.DEVURL}/sucess`,
    cancel_url: `${process.env.DEVURL}/shoppingCart`,
  })
  return res.json({ session: session })
})

module.exports = stripeRouter
