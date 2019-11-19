const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const cookieParser = require('cookie-parser')
const sqlite = require('sqlite')
const multer = require('multer')
const url = require('url')

const app = express()
const server = http.createServer(app)
const ioSerer = socketIO(server)

const uploader = multer({
  dest: './upload',

})
const sharp = require('sharp')
const fs = require('fs')
const fsp = fs.promises

const dbPromise = sqlite.open(__dirname + '/db/voting.sqlite3')


let db

const port = 3005

const changePasswordTokenMap = {}

ioSerer.on('connection', socket => {
  var path = url.parse(socket.request.headers.referer).path
  socket.join(path)
})

app.locals.pretty = true


app.set('views', __dirname + '/tpl')
// let userCache = []


app.use((req, res, next) => {
  res.setHeader('Content-type', 'text/html; charset=UTF-8')
  next()
})

app.use(express.static(__dirname + '/static'))

app.use(cookieParser('secure'))

app.use(express.json())

app.use(express.urlencoded({
  extended: true
}))

app.get('/',async (req, res, next) => {
  console.log(req.cookie)
  console.log(req.signedCookies)
  if (req.signedCookies.userid) {
    var user = await db.get('SELECT name FROM users WHERE rowid=?', req.signedCookies.userid)
    res.send(`
      <div>
        <span>${user.name}已登录</span>
        <a href="/create.html">创建投票</a>
        <a href="/logout">登出</a>
      </div>
    `)
  } else {
    res.send(`
      <div>
        <a href="/register">注册</a>
        <a href="/login">登录</a>
      </div>
    `)
  }
})

app.post('/create-vote', async (req, res, next) => {
  var vote = req.body
  console.log(req.body)
  await db.run('INSERT INTO votes (title, desc, userid, singleSelection, deadline, anonymouse) VALUES (?,?,?,?,?,?)', vote.title, vote.desc, req.signedCookies.userid, vote.singleSelection, vote.deadline, vote.anonymouse)

  var voteinfo = await db.get('SELECT * FROM votes ORDER BY id DESC LIMIT 1')

  await Promise.all(vote.options.map((it) => {
    return db.run('INSERT INTO options (content, voteid) VALUES (?,?)', it, voteinfo.id)
  }))

  res.redirect('/vote/' + voteinfo.id)
})

app.get('/vote/:id', async (req, res, next) => {
  var vote = await db.get('SELECT rowid,* FROM votes WHERE rowid=?', req.params.id)
  var options = await db.all('SELECT * FROM options WHERE voteid=?', req.params.id)
  // console.log(options)

  res.render('vote.pug', {
    vote: vote,
    options: options
  })
})

app.post('/voteup', async (req, res, next) => {
  var userid = req.signedCookies.userid
  var body = req.body
  var voteid = body.voteid

  
  var voteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, body.voteid)

  if (voteupInfo) {
    // return res.end()
    await db.run('UPDATE voteups SET optionid=? WHERE userid=? AND voteid=?', body.optionid, userid, body.voteid)
  } else {
    await db.run('INSERT INTO voteups (userid, optionid, voteid) VALUES (?,?,?)', userid, body.optionid, body.voteid)
  }
  
  ioSerer.in(`/vote/&{voteid}`).emit('new vote', {
    userid,
    voteid,
    optionid: body.optionid
  })

  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', body.voteid)
  res.json(voteups)

})

//用户获取某个问题的投票信息
app.get('/voteup/:voteid/info', async(req, res, next) => {
  var userid = req.signedCookies.userid
  var voteid = req.params.voteid
  var userVoteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, voteid)

  if (userVoteupInfo) {
    var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', voteid)
    res.json(voteups)
  } else {
    res.json(null)
  }
})

app.route('/register')
  .get((req, res, next) => {
    res.send(`
      <form action="/register" method="post">
        用户名：<input type="text" name="name" /> <br>
        邮箱：<input type="text" name="email" /> <br>
        密码：<input type="text" name="password" /> <br>
        <button>提交</button>
      </form>
    `)
  })
  .post(async (req, res, next) => {
    var info = req.body
    var user = await db.get('SELECT * FROM users WHERE name=?', info.name)
    if (user) {
      res.end(`
        此用户名已被注册，即将跳转回注册页面
        <script>
          setTimeout(() => {
            location.href="/register"
          }, 3000)
        </script>
      `)
    } else {
      await db.run('INSERT INTO users VALUES (?,?,?)', info.name, info.email, info.password)
      res.end(`
        注册成功,即将跳转至登陆页面...
        <script>
          setTimeout(() => {
            location.href="/login"
          }, 3000)
        </script>
      `)
    }
  })

app.route('/login')
  .get((req, res, next) => {
    res.send(`
      <form action="/login" method="post" id="loginform">
        用户名：<input type="text" name="name" /> <br>
        密码：<input type="text" name="password" /> <br>
        <a href="/forgot">忘记密码</a> <br>
        <button id="btn">登陆</button>
      </form>
      <script>
        btn.onclick = e => {
          e.preventDefault()
          console.log(1111)
          var name = document.querySelector('[name="name"]').value
          var pw = document.querySelector('[name="password"]').value

          var xhr = new XMLHttpRequest()
          xhr.open('POST', '/login')
          xhr.onload = function() {
            var data = JSON.parse(xhr.responseText)
            if (data.pass == -1) {
              var node = document.createElement('span')
              node.style.color = 'red'
              node.textContent = '用户名或密码错误'
              loginform.insertBefore(node, document.querySelector('a'))
            } else if (data.pass == 0) {
              alert('登陆成功，即将进行跳转')
              setTimeout(() => {
                location.href = '/'
              }, 2500)
            }
            console.log('sdfasdf' + xhr.responseText)
          }
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
          xhr.send('name=' + name + '&password=' + pw)

        }
      </script>

    `)
  })
  .post(async (req, res, next) => {
    var info = req.body
    var user = await db.get('SELECT rowid,* FROM users WHERE name=? AND password=?', info.name, info.password)
    console.log(user)
    if (user) {
      res.cookie('userid', user.rowid, {
        signed: true
      })
      res.json({pass: 0})
    } else {
      res.json({pass: -1})
      // res.send('用户名或密码错误')
    }
  })

  app.get('/logout', (req, res, next) => {
    res.clearCookie('userid')
    res.redirect('/')
  })

  app.route('/forgot')
    .get((req, res, next) => {
      res.send(`
        <form action="/forgot" method="post">
          请输入您的邮箱:<input type="text" name="email">
          <button>确定</button>
        </form>
      `)
    })
    .post(async (req, res, next) => {
      var email = req.body.email
      var user = await db.get('SELECT * FROM users WHERE email=?', email)
      if (!user) {
        res.end('不存在此用户')
      }
      var token = Math.random().toString().slice(2)
      changePasswordTokenMap[token] = email

      setTimeout(() => {
        delete changePasswordTokenMap[token]
      }, 60 * 1000 * 20);//20分钟后删除token

      var link = `http://localhost:3005/change-password/${token}`

      console.log(link)

      res.end('已向邮箱发送密码重置链接,有效期20分钟')
    })

app.route('/change-password/:token')
  .get((req, res, next) => {
    var token = req.params.token
    var email = changePasswordTokenMap[token]
    if (email) {
      res.end(`
        此页面可以重置${email}用户的密码
        <form action="" method="post">
          <input type="password" name="password">  <br>
          <button>确定</button>
        </form>
      `)
    } else {
      res.end('无效链接')
    }
  })
  .post(async (req, res, next) => {
    var token = req.params.token
    var email = changePasswordTokenMap[token]
    var password = req.body.password
    if (email) {
      await db.run('UPDATE users SET password=? WHERE email=?', password, email)
      res.end('密码修改成功')
      delete changePasswordTokenMap[token]
    } else {
      res.end('此链接已失效')
    }
  })
  



dbPromise.then(dbObject => {
  db = dbObject
  server.listen(port, () => {
    console.log('server listening on port', port)
  })
})