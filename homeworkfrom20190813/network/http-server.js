var net = require('net')

var server = net.createServer()

var port = 8080

// http://localhost:8080/


server.on('connection', conn => {
  
  conn.on('data', data => {
    console.log(data.toString())
  })

})

server.listen(port, () => {
  console.log('server listening on port', port)
})