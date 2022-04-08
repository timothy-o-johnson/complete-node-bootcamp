const crypto = require('crypto')
const { promisify } = require('util')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

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
    passwordChangedAt: req.body.passwordChangedAt,
    passwordConfirmation: req.body.passwordConfirmation,
    role: req.body.role
  }

  const newUser = await User.create(newUserObj)

  createSendToken(newUser, 201, res)
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

  console.log({ user })

  // 3. if all is good, send token
  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1. get token and confirm existence
  let token

  const authorization = req.headers.authorization

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]

    console.log({ token })
  }

  if (!token) {
    return next(
      new AppError('you are not logged in! please log in to get access.', 401)
    )
  }

  // 2. verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log({ decoded })

  // 3. verify user exists
  const currentUser = await User.findById(decoded.id)
  console.log({ currentUser })

  if (!currentUser) {
    return next(
      new AppError('the user belonging to this token no longer exists.', 401)
    )
  }

  // 4. check if user changed password after token was issued
  const passwordHasChanged = currentUser.changedPasswordAfter(decoded.iat)

  if (passwordHasChanged) {
    return next(
      new AppError('user recently changed password! please log in again', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'lead-guide']
    const isAuthorizedUser = roles.includes(req.user.role)

    if (!isAuthorizedUser) {
      return next(
        new AppError(`you don't have permission to perform this action`, 403)
      )
    }

    next()
  }
}

exports.forgotPassword = async (req, res, next) => {
  console.log('in exports.forgotPassword')

  // 1) get user based on POSTed email
  const user = await User.findOne({
    email: req.body.email
  })

  console.log('user', user)

  if (!user) {
    return next(new AppError(`there is no user with that email address.`, 404))
  }

  // 2) generate random token
  const resetToken = user.createPasswordResetToken()
  console.log('resetToken', resetToken)

  await user.save({ validateBeforeSave: false })

  // res.status(200).json({
  //   status: 'success',
  //   resetToken // resetToken = await user.createResetPasswordToken();
  // })

  // 3) sent it to user's email.
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`

  const message = `forgot your password?\n\nsubmit a PATCH request with your new password and passwordConfirm to:\n\n${resetURL}.\n\nif you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid for 10 min)',
      message
    })

    res.status(200).json({
      status: 'success',
      message: 'token sent to email!'
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordReetExpires = undefined
    console.log('err', err)

    await user.save({
      validateBeforeSave: false
    })

    return next(
      new AppError('there was an error sending the email. try again!', 500)
    )
  }
}

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  console.log({ hashedToken, user })

  // 2) if token has not expired, and there is a user, set the password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordConfirmation = req.body.passwordConfirmation
  user.passwordResetExpires = undefined
  user.passwordResetToken = undefined

  await user.save({
    validateBeforeSave: true
  })

  // 3) update changePasswordAt property for the user
  createSendToken(user, 200, res)

  // 4) log the user in, send JWT

  next()
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection

  console.log('in exports.updatePassword')

  // since the user is logged in we have the id;
  // because the password is not included in the return, must request it explicitly
  const user = await User.findById(req.user.id).select('+password')

  // user.findByIdAndUpdate

  console.log('user', user)

  // 2) verify POSTed current password
  const currentPassword = req.body.passwordCurrent

  const correctPassword = await user.correctPassword(currentPassword, user.password)

  // 3) if so, update password
  if (correctPassword) {
    user.password = req.body.password
    user.passwordConfirmation = req.body.passwordConfirmation
  } else {
    return next(new AppError('wrong current password', 401))
  }

  await user.save()

  // 4) log user in, send JWT
  createSendToken(user, 200, res)
})
