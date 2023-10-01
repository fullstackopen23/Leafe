const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

usersRouter.get('/', (request, response) => {
  User.find({}).then((users) => {
    response.json(users)
  })
})

usersRouter.post('/', async (request, response) => {
  const { email, name, password, shoppingCart } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    name,
    passwordHash,
    shoppingCart,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.post('/:id/cart', async (request, response) => {
  const decodedToken = jwt.verify(
    getTokenFrom(request),
    process.env.SECRET
  )
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  console.log(request.body)
  user.shoppingCart = [...request.body]

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/:id/cart', async (request, response) => {
  const user = await User.findById(request.params.id).populate(
    'shoppingCart.productId'
  )
  console.log(user)
  response.status(201).json(user)
})

usersRouter.delete('/', (request, response) => {
  User.deleteMany({}).then((users) => {
    response.json(users)
  })
})

module.exports = usersRouter
