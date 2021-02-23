const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  console.log('handleCastErrorDB(), err', err)
  
  const message = `Invalid field --> '${err.path}' : '${err.value}'.`

  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status, 
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  //operation, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.log('ERROR 💣 ')

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  // console.log('JSON.stringify(err)', JSON.stringify(err))
  // console.log('err', err)
  console.log('err.name', err.name)


  err.statusCode = err.StatusCode || '500'
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error  = {...err}
    error.name = err.name
     
    if (error.name === 'CastError') error = handleCastErrorDB(error)

    sendErrorProd(error, res)
  }
}


/Users/timjohnson/Google Drive/Me/Hobbies/Projects/Software Development/complete-node-bootcamp/complete-node-bootcamp-main/4-natours/starter/controllers/errorController.js