var net = require('net')
var querystring = require('querystring')

var server = net.createServer()

var port = 8080


server.on('connection', conn => {
  conn.on('data', data => {
    var request = data.toString()
    var [header, body] = request.split('\r\n\r\n')
    var [firstLine, ...headers] = header.split('\r\n')
    var [method, path] = firstLine.split(' ')
    
    var header = {}
    for (var i of headers) {
      var [key, val] = i.split(': ')
      header[key.toLowerCase()] = val
    }
    
    if (path == '/author') {
      if (header['accept'] == 'text/html') {
        conn.write('HTTP/1.1 200 OK\r\n')
        conn.write('Access-Control-Allow-Origin: *\r\n')
        conn.write('Content-type: text/html; charset=UTF-8\r\n')
        conn.write('\r\n')
        conn.end(`<div>I'm the author</div>`)
      }

      if (header['accept'] == 'text/plain') {
        conn.write('HTTP/1.1 200 OK\r\n')
        conn.write('Access-Control-Allow-Origin: *\r\n')
        conn.write('Content-type: text/plain; charset=UTF-8\r\n')
        conn.write('\r\n')
        conn.end(`gogo Let's go`)
      }

      if (header['accept'] == 'application/json') {
        conn.write('HTTP/1.1 200 OK\r\n')
        conn.write('Access-Control-Allow-Origin: *\r\n')
        conn.write('Content-type: application/json\r\n')
        conn.write('\r\n')
        conn.end(`{"info": "author is Martin(still alive)"}`)
      }
    }

    if (path == '/') {
      conn.write('HTTP/1.1 200 OK\r\n')
      conn.write('\r\n')
      conn.end('ikunikunikunikunikunikunikunikunikunikunikunikunikun')
    }


  })
})

server.listen(port, () => {
  console.log('server listening on port', port)
})



// HTTP/1.1 200 OK//首部
// Content-Type: text/html
// Content-Length: 892
// Date: 

// 头