const nodemailer = require('nodemailer')
// const { eventNames } = require('../models/userModel')

const sendEmail = async options => {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // activiate in gmail 'less secure app' options
  })

  // 2) define the email options
  const mailOptions = {
    from: 'Tim Johnson <hello@timjohnson.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //   html:
  }

  // 3) actually send the mail

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail