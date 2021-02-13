const catchAsync = fn => {
  return (req, res, next) => {
    console.log('in catchAsync()')

    fn(req, res, next).catch(err => next(err))
  }
}

module.exports = catchAsync