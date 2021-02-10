const { response } = require('express')
const express = require('express')

const morgan = require('morgan')

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
  .use('/api/v1/tours', tourRouter)
  .use('/api/v1/users', userRouter)
  .all('*', (req, res, next) => {
    // res.status(404).json({
    //   status:'fail',
    //   message: `ain't no '${req.originalUrl}' on this server!`
    // })

    const err = new Error(`ain't no '${req.originalUrl}' on this mutha-effin server!`)
    err.statu = 'fail'
    err.statusCode = 404

    next(err) // express assumes that any param sent with next is an error and will skip to the error handling portion of the code
  })
  .use((err, req, res, next) => {
    err.statusCode = err.StatusCode || '500'
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  })

module.exports = app
