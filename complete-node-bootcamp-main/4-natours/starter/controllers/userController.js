const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const errorMessage = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!'
  })
}

exports.createUser = (req, res) => {
  errorMessage(req, res)
}

exports.deleteUser = (req, res) => {
  errorMessage(req, res)
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  // send response

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
})

exports.getUser = (req, res) => {
  errorMessage(req, res)
}

exports.updateUser = (req, res) => {
  errorMessage(req, res)
}
