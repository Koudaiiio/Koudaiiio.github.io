const http = require('http')

const server = http.createServer()
const port = 8899

server.on('request', (request, response) => {
  console.log(request.method, request.url)
  console.log(request.headers)

  response.write('hello world')
  response.end()
})

server.listen(port, () => {
  console.log('server listening on port', port)
})