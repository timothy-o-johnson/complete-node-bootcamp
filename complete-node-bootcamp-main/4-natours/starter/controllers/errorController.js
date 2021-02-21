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
  if (error.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.log('ERROR 💣 ');

    // 2) send generic message
    res.status(500).jsohn({
      status: 'error',
      message: 'something went very wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
 
  err.statusCode = err.StatusCode || '500'
  err.status = err.status || 'error'
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res)
  }

  res.status(err.statusCode).json(errObj)
}
