const fs = require('fs')
const multer = require('multer')
const md5 = require('md5')
const express = require('express')
const sharp = require('sharp')
const fsp = fs.promises

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const uploader = multer({ storage: storage })

let db
(async () => {
  db = await require('./db')
})()

const changePasswordTokenMap = {}
const mailer = require('./mailer')

const app = express.Router()

app.route('/register')
  .post(uploader.single('avatar'), async (req, res, next) => {
    var regInfo = req.body

    // console.log('register', regInfo)
    var user = await db.get('SELECT * FROM users WHERE name=?', regInfo.name)

    if (user) {

      if (req.file) {
        await fsp.unlink(req.file.path)
      }

      res.status(403).json({
        code: -1,
        msg: '用户名已被占用'
      })
    } else {
      if (req.file) {
        var imgBuf = await fsp.readFile(req.file.path)
        await sharp(imgBuf)//把上传的图片变小
          .resize(256)
          .toFile(req.file.path)
      }
      var file = req.file ? 'upload/' + req.file.filename : null
      await db.run('INSERT INTO users (name, email, password, avatar) VALUES (?,?,?,?)', regInfo.name, regInfo.email, regInfo.password, file)

      var newuser = await db.get('SELECT * FROM users WHERE name=?', regInfo.name)

      res.cookie('userid', newuser.id, {
        signed: true
      })

      res.json({
        code: 0,
        msg: '注册成功'
      })
    }
  })

app.get('/userinfo', async (req, res, next) => {
  var userid = req.signedCookies.userid
  if (userid) {
    res.json(await db.get('SELECT id,name,avatar FROM users WHERE id=?', userid))
  } else {
    res.status(404).end()
  }
})

app.route('/login')
  .post(async (req, res, next) => {
    var tryLoginInfo = req.body
    // console.log(tryLoginInfo)

    if (tryLoginInfo.captcha != req.session.captcha) {
      res.json({code: -1, msg: '验证码错误'})
      return 
    }
    var user = await db.get('SELECT id,name,avatar FROM users WHERE name=? AND password=?', tryLoginInfo.name, tryLoginInfo.password)
    if (user) {
      res.cookie('userid', user.id, {
        signed: true
      })
      res.json(user)
    } else {
      res.status(401).json({
        code: -1,
        msg: '用户名或密码错误'
      })
    }
  })

app.route('/forgot')
  .post(async (req, res, next) => {
    var email = req.body.email
    var user = await db.get('SELECT * FROM users WHERE email=?', email)
    if (!user) {
      res.status(401).json({
        code: -1,
        msg: '不存在此用户'
      })
      return
    }

    var token = Math.random().toString().slice(2)

    changePasswordTokenMap[token] = email

    setTimeout(() => {
      delete changePasswordTokenMap[token]
    }, 60 * 1000 * 20)//20分钟后删除token

    var link = `https://www.cyluck.club/change-password/${token}`

    // console.log(link)

    mailer.sendMail({
      from: '251809052@qq.com',
      to: email,
      subject: '密码修改',
      text: link
    }, (err, info) => {
      res.json({
        code: 0,
        msg: '已向您的邮箱发送密码重置链接，请于20分钟内点击链接修改密码！'
      })
    })
  })

app.route('/change-password/:token')
  // .get(async (req, res, next) => {
  //   var token = req.params.token
  //   var name = changePasswordTokenMap[token]

  //   if (!name) {
  //     res.end('链接已失效')
  //     return
  //   }

  //   var user = await db.get('SELECT *FROM users WHERE')
  // })
  .post(async (req, res, next) => {
    var token = req.params.token
    var email = changePasswordTokenMap[token]
    var password = req.body.password

    if (!email) {
      res.json({
        code: -1,
        msg: '链接已失效'
      })
      return
    }

    delete changePasswordTokenMap[token]

    await db.run('UPDATE users SET password=? WHERE email=?', password, email)

    res.end({
      code: 0,
      msg: '密码修改成功'
    })
  })

app.get('/logout', (req, res, next) => {
  res.clearCookie('userid')
  res.end()
})

app.route('/change-avatar')
  .post(uploader.single('avatar'), async (req, res, next) => {
    var userInfo = await db.get('SELECT * FROM users WHERE id=?', req.signedCookies.userid)

    // if (userInfo.avatar && typeof userInfo.avatar == 'string') {
    //   await fsp.unlink(__dirname + '/' + userInfo.avatar)
    // }
    var imgBuf = await fsp.readFile(req.file.path)
    await sharp(imgBuf)//把上传的图片变小
      .resize(256)
      .toFile(req.file.path)
    var file = req.file ? 'upload/' + req.file.filename : null
    await db.run('UPDATE users SET avatar=? WHERE id=?', file, req.signedCookies.userid)
    var ava = await db.get('SELECT avatar FROM users WHERE id=?', userInfo.id)
    res.json(ava)
  }
)

module.exports = app