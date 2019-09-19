var http = require('http')

var port = 8080

var fs = require('fs')

var myMap = {
  '.jpg': 'image/jpg',
  '.txt': 'text/plain'
}

var server = http.createServer(function(request, response) {
  var path = decodeURIComponent('f:/mygit/' + request.url)
  // response.write(path)
  // var path = request.url
  fs.stat(path, (err, info) => {
    if (err) {
      response.writeHead(404, {
        'Content-Type': 'text/html; charset=UTF-8'
      })
      response.end('请求的文件不存在')
    } else {
      if (info.isFile()) {
        fs.readFile(path, (err, content) => {
          if (err) {
            response.write('')
          }
          response.writeHead(200, {'Content-type': 'text/html;charset=UTF-8'})
          response.write(content.toString())
          response.end()
        })
      } else {
        fs.readdir(path, (err, names) => {
          if (names.indexOf('index.html') >= 0) {
            fs.readFile(path + '/index.html', (err, info) => {
              response.write(info.toString())
              response.end()
            })
          } else {
            response.writeHead(200, {'Content-type': 'text/html;charset=UTF-8'})
            response.write('<ul>')
            for (var name of names) {
              response.write('<li><a href=' + name + '>' + name + '</a></li>')
            }
            response.write('</ul>')
            response.end()
          }
        })
      }
    }
  })
})

server.listen(port, () => {
  console.log('listenning on port', port)
})