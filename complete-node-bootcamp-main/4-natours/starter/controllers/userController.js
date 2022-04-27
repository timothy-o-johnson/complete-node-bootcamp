const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')

const errorMessage = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined!'
  })
}

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)){
      newObj[el] = obj[el]
    }
  })

  return newObj
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

exports.updateMe = catchAsync(async (req, res, next) => {
  // convention is to have different route for changing password and changing other data

  // 1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'this route is not for password updates. please use: `/updatePassword`',
        400
      )
    )
  }

  // 2) filter unwanted field names not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email')

  // 2) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data:{
      user: updatedUser
    }
  })
})

exports.updateUser = (req, res) => {
  errorMessage(req, res)
}
