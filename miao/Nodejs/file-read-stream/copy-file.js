// const {createReadStream, creatWriteStream} = require('./file-read-stream.js')

// createReadStream('aaa.json').pipe(creatWriteStream('bbb.json'))

var fs = require('fs')

// fs.readFile('123.mkv', (err, data) => {
//   fs.writeFile('bbb.mkv', data, () => {
//     console.log('done')
//   })
// })

var rs = fs.createReadStream('123.mkv')
var ws = fs.createWriteStream('bbb.mkv')
// var ws = fs.createWriteStream('bbb.mkv', {
//     highWaterMark: 1024 * 1024 * 20
//   })

rs.on('data', data => {
  console.log(ws.write(data))
  if (ws.write(data) == false) {
    rs.pause()
  }
})

rs.on('end', data => {
  ws.end() 
})

ws.on('drain', () => {
  console.log('drain')
  rs.resume()
})

// rs.pipe(ws)