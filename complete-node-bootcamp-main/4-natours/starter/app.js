const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// (1) GLOBAL MIDDLEWARE
// middleware is added in order
// don't forget to call the next parameter

// set security http headers
app.use(helmet())

// development logging

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowms: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again in 1 hour1'
})

app.use('/api', limiter)

app
  // body parser, reading data from body into req.body
  .use(express.json({ limit: '10kb' }))
  // serving static files
  .use(express.static(`${__dirname}/public`))
  // helpful for testing middleware
  .use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log('tours!', req.headers)

    next()
  })

// 2) ROUTES
app
  .use('/api/v1/tours', tourRouter)
  .use('/api/v1/users', userRouter)
  .all('*', (req, res, next) => {
    console.log('*** getting error ***')
    // console.log('JSON.stringify(err)', JSON.stringify(err))
    // express assumes that any param sent with next is an error and will skip to the error handling portion of the code
    next(new AppError(`ain't no '${req.originalUrl}' on this server!`, 404))
  })

app.use(globalErrorHandler)

module.exports = app
