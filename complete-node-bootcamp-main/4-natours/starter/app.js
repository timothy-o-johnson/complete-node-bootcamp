const { response } = require('express')
const express = require('express')

const morgan = require('morgan')

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

app
  .use(express.json())
  .use(express.static(`${__dirname}/public`))
  .use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
  })

// 2) ROUTES
app
  .use('/api/v1/tours', tourRouter)
  .use('/api/v1/users', userRouter)
  .all('*', (req, res, next) => {
    // res.status(404).json({
    //   status:'fail',
    //   message: `ain't no '${req.originalUrl}' on this server!`
    // })

    // const err = new Error(`ain't no '${req.originalUrl}' on this mutha-effin server!`)
    // err.statu = 'fail'
    // err.statusCode = 404
    console.log('*** getting error ****');
    

    next(
      new AppError(
        `ain't no '${req.originalUrl}' on this mutha-effin server!`,
        404
      )
    ) // express assumes that any param sent with next is an error and will skip to the error handling portion of the code
  })

app.use(globalErrorHandler)

module.exports = app
