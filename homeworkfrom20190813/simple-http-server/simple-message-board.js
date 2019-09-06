var net = require('net')

var server = net.createServer()

var querystring = require('querystring')

var port = 8080

var messages = [{
  name: '小李', 
  message: 'aaa',
  time: 1231312312
}]

server.on('connection', conn => {
  conn.on('data', data => {
    data = data.toString()
    var [head, body] = data.split('\r\n\r\n')
      , [Firstline, ...others] = head.split('\r\n')
      , [protocol , path] = Firstline.split(' ')

    if (protocol == 'POST') {
      body = querystring.parse(body)
      body.time = new Date()
      messages.push(body)
      conn.write(`HTTP/1.1 302 Moved
Location: /`)
      conn.end()
      return
    }

    if (true || protocol == 'GET') {
      conn.write(
`HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Date: ${new Date()}

<form method="POST" action="/">
  Name: <br>
  <input name="name" /> <br>
  Message: <br>
  <textarea name="message"></textarea>
  <br>
  <button>提交</button>
</form>
<hr>`)
      messages.reduceRight((_, msg) => {
        var html = `
          <div>
            <strong>${msg.name}</strong><span>${msg.time}</span>
            <p>${msg.message}</p>
          </div>
          `
        conn.write(html)
      }, null)
      conn.end()
      return
    }
  })

})

server.listen(port, () => {
  console.log('Listening on port', port)
})