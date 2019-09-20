const express = require('express')
const port = 3006
const app = express()

var pendingres = []

app.use(express.raw)

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/msg', (req, res, next) => {
  pendingres.push(res)
})

app.post('/', (req, res, next) => {
  pendingres.forEach(response => {
    response.end(req.body.msg)
  })
  res.end()
})

app.listen(3006, () => {
  console.log('listening on port', port)
})