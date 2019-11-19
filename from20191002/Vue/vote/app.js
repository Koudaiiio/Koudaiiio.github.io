
const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const socketIO = require('socket.io')
const cors = require('cors')
const session = require('express-session')

const app = express()
const server = http.createServer(app)

const port = 4001


app.use(express.static(__dirname + '/static'))

// app.route((req, res, next) => {
//   res.setHeader('Content-type', 'text/html; charset=UTF-8')
// }))

app.use(express.json())//解析json请求体的中间件

app.use(express.urlencoded({//解析url编码的中间件
  extended: true
}))

const ioServer = socketIO(server)
global.ioServer = ioServer
ioServer.on('connection', socket => {
  socket.on('select room', roomid => {
    socket.join('/vote/' + roomid)
  })
})

app.use(cors({
  maxAge: 86400,
  credentials: true,
  origin: function(origin, cb) {
    cb(null, true)
  }
}))

app.use(session({secret: 'my secret', resave: false, cookie: { maxAge: 60000 }, saveUninitialized: false}))

app.use(cookieParser('my secret'))

app.use(express.static(__dirname + '/static/'))
app.use('/upload', express.static(__dirname + '/upload'))

const userAccount = require('./user-account')
const voteRouter = require('./vote-router')

app.use('/api', userAccount)
app.use('/api', voteRouter)


// app.get('/', async(req, res, next) => {
//   console.log(req.cookies)
//   console.log(req.signedCookies)
//   if (req.signedCookies.userid) {
//     res.json({isSignedin: true})
//   }
// })

server.listen(port, () => {
  console.log('listening on port', port)
})
