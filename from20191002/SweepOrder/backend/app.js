const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userAccountMiddleware = require('./user-account')
const restaurantMiddleware = require('./restaurant')

const port = 5000

const app = express()

app.use(express.urlencoded({extended: true})) //用来解析扩展url编码的请求体
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body)
  next()
})

app.use(cors({
  allow: true,
  maxAge: 86400,
  credentials: true,
}))

app.use(cookieParser('secret'))

app.use(express.static(__dirname + '/static')) //处理静态文件请求的中间件

app.use(express.json()) //用来解析json请求体

app.use('/api', userAccountMiddleware)
app.use('/api', restaurantMiddleware)


app.listen(port, () => {
  console.log('server listening on port', port)
})