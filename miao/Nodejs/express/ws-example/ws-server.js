const http = require('http')
const socketIO = require('socket.io')
const server = http.createServer()

const ioServer = socketIO(server)

ioServer.on('connection', ws => {
  ws.on('hello', data => {
    ws.emit('hello', {a:1})
  })
})

server.on('request', (req, res) =>{
  if (req.method == 'GET' && req.url == '/') {
    res.end(`
      <script src="/socket.io/socket.io.js"></script>
      <script>
        var socket = io()
      </script>
    `)
  }
})




server.listen(3007, () => {
  console.log(3007)
})