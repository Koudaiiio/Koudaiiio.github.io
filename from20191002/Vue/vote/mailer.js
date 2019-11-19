var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '251809052',
    pass: ''
  }
})

module.exports = transporter