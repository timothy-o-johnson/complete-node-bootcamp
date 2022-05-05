const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// (1) MIDDLEWARE
// middleware is added in order
// don't forget to call the next parameter
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 100,
  windowms: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again in 1 hour1'
})

app.use('/api', limiter)

app
  .use(express.json())
  .use(express.static(`${__dirname}/public`))
  .use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log('tours!', req.headers);
    
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
