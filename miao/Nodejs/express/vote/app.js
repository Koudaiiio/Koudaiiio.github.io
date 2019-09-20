const express = require('express')
const cookieParser = require('cookie-parser')

const port = 3005

const app = express()

let userCache = []

const changePasswordTokenMap = {}

app.use((req, res, next) => {
  res.setHeader('Content-type', 'text/html; charset=UTF-8')
  next()
})

app.use(express.static(__dirname + '/static'))

app.use(cookieParser('secure'))

app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res, next) => {
  console.log(req.cookie)
  console.log(req.signedCookies.user)
  if (req.signedCookies.user) {
    res.send(`
      <div>
        <span>${req.signedCookies.user}已登录</span>
        <a href="/create">创建投票</a>
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

app.get('/create', (req, res, next) => {

})

app.get('/vote/:id',  (req, res, next) => {

})

app.route('/register')
  .get((req, res, next) => {
    res.send(`
      <form action="/register" method="post">
        用户名：<input type="text" name="name" />
        邮箱：<input type="text" name="email" />
        密码：<input type="text" name="password" />
        <button>提交</button>
      </form>
    `)
  })
  .post((req, res, next) => {
    var info = req.body
    console.log(info)
    if (userCache.findIndex(it => it['name'] == info['name']) >= 0) {
      res.end(`此用户名已被注册，即将跳转回注册页面`)
    } else {
      userCache.push(info)
      res.end('注册成功')
    }
  })

app.route('/login')
  .get((req, res, next) => {
    res.send(`
      <form action="/login" method="post">
        用户名：<input type="text" name="name" />
        密码：<input type="text" name="password" />
        <a href="/forgot">忘记密码</a>
        <button>登陆</button>
      </form>
    `)
  })
  .post((req, res, next) => {
    var info = req.body
    if (userCache.findIndex(it => {
      return it.name == info.name && it.password == info.password
    }) >= 0) {
      res.cookie('user', info.name, {
        signed: true
      })
      res.redirect('/')
    } else {
      res.send('用户名或密码错误')
    }
  })

  app.get('/logout', (req, res, next) => {
    res.clearCookie('user')
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
    .post((req, res, next) => {
      var email = req.body.email
      var token = Math.random().toString().slice(2)
      changePasswordTokenMap[token] = email

      setTimeout(() => {
        delete changePasswordTokenMap[token]
      }, 60 * 1000 * 20);//20分钟后删除token

      var link = `http://localhost:3005/change-password/${token}`

      console.log(link)

      res.end('已向邮箱发送密码重置链接')
    })

app.route('/change-password/:token')
  .get((req, res, next) => {
    var token = req.params.token
    var user = userCache.find(it => it.email === changePasswordTokenMap[token])
    if (user) {
      res.end(`
        此页面可以重置${user.name}的密码
        <form action="" method="post">
          <input type="password" name="password"> 
          <button>确定</button>
        </form>
      `)
    } else {
      res.end('无效链接')
    }
  })
  .post((req, res, next) => {
    var token = req.params.token
    var user = userCache.find(it => it.email === changePasswordTokenMap[token])
    var password = req.body.password
    if (user) {
      user.password = password
      res.end('密码修改成功')
      delete changePasswordTokenMap[token]
    } else {
      res.end('此链接已失效')
    }
  })
  




app.listen(port, () => {
  console.log('server listening on port', port)
})