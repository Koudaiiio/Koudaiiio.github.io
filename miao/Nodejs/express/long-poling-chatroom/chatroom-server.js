const express = require('express')
const port = 3007
const app = express()

var pendingres = []

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res, next) => {
  console.log(123213)
  res.sendFile(__dirname + '/index.html')
})

app.get('/msg', (req, res, next) => {
  pendingres.push(res)
})

app.post('/msg', (req, res, next) => {
  console.log(req.body)
  pendingres.forEach(response => {
    response.end(req.body.msg)
  })
  res.end()
})

app.listen(port, () => {
  console.log('listening on port', port)
})