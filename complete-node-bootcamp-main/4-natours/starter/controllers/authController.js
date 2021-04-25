const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const AppError = require('./../utils/appError')

const signToken = id => {
  const jwtSecret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN

  return jwt.sign({ id }, jwtSecret, { expiresIn })
}

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body)
  // replaced above code because a new user would be able to make themself an admin
  console.log(req)

  const newUserObj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  }

  const newUser = await User.create(newUserObj)

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1. verify email and password exist

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400))
  }

  // 2. verify user exists && password is correct
  const user = await User.findOne({
    email
  }).select('+password')

  const correctPassword =
    user && (await user.correctPassword(password, user.password))

  if (!user || !correctPassword) {
    return next(new AppError('Incorrect email or password', 401))
  }

  console.log(user)

  // 3. if all is good, send token
  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1. get token and confirm existence
  let token

  const authorization = req.headers.authorization

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]

    console.log(token)
  }

  if (!token) {
    return next(
      new AppError('you are not logged in! please log in to get access.', '401')
    )
  }

  // 2. verify token

  // 3. verify user exists

  // 4. check if user changed passwored after token was issued
  next()
})
