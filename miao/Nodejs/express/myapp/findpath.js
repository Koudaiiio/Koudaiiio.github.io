var http = require('http')

var port = 8090

var server = http.createServer((req, res) => {
  console.log(__dirname)
  res.end()
})

server.listen(port, () => {
  console.log(port)
})