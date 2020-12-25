const { response } = require('express')
const express = require('express')

const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// (1) MIDDLEWARE
// middleware is added in order
// don't forget to call the next parameter
app
  .use(morgan('dev'))
  .use(express.json())
  .use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
  })
  .use('/api/v1/tours', tourRouter)
  .use('/api/v1/users', userRouter)


module.exports = app