const express = require('express')

const port = 3005

const app = express()

app.use(express.static(__dirname + '/static'))

app.get('/', (req, res, next) => {
  res.send(`
    <div>

  `)
})

app.get('/create', (req, res, next) => {

})

app.get('/vote/:id',  (req, res, next) => {

})

app.route('/register')
  .get((req, res, next) => {
    res.send(`
      <form action="/register" method="post">
        用户名：<input type="text" name="username" />
        邮箱：<input type="text" />
        密码：<input type="text" />
      </form>
    `)
})

app.get('/login',  (req, res, next) => {

})