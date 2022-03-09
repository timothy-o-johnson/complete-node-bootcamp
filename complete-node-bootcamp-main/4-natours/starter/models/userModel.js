const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Users must have a name']
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'User must have a valid email.'],
      required: [true, 'Users must have an email'],
      unique: true,
      lowercase: true
    },
    photo: {
      type: String
    },
    password: {
      type: String,
      required: [true, 'Users must have a password'],
      minlength: 8,
      select: false
    },
    passwordChangedAt: Date,
    passwordConfirmation: {
      type: String,
      required: [true, 'Passwords must match'],
      validate: {
        // only works on create/save (when it hits th server-- server-side?)
        validator: function (passwordConfirmation) {
          return passwordConfirmation === this.password
        },
        message: 'passwords are not the same!'
      },
      select: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ['admin', 'guide', 'lead-guide', 'user'],
      default: 'user'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

userSchema.pre('save', async function (next) {
  var passwordModified = this.isModified('password')

  if (!passwordModified) {
    return next()
  }

  // hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // delete password confirmation field
  this.passwordConfirmation = undefined

  next()
})

// compare/verify hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  console.log({ userSchema })
  let passwordHasChanged = false

  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    console.log(`ChangedPasswordAfter()`, changedTimestamp, JWTTimestamp) //

    passwordHasChanged = JWTTimestamp < changedTimestamp
    return passwordHasChanged
  }

  return passwordHasChanged
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  const minutes = 10
  const secondsFactor = 60
  const millisecondsFactor = 1000

  console.log({ resetToken }, this.passwordToken)

  this.passwordResetExpires =
    Date.now() + minutes * secondsFactor * millisecondsFactor

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
