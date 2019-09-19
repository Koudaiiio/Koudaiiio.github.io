const { Readable, Writable } = require('stream')
const fs = require('fs')


exports.createReadStream = function createReadStream(path) {
  var fd = fs.openSync(path, 'r')
  var fileSize = fs.statSync(path).size
  var position = 0

  return new Readable({
    read(size) {
      var buf = Buffer.alloc(1024)
      if (position >= fileSize) {
        this.push(null)
        fs.close(fs, (err) => {
          if (err) {
            console.log(err)
          }
        })
      } else {

        fs.read(fd, buf, 0, 1024, position, (err, byteRead) => {
          if (err) {
            console.log(err)
            return
          }
          if (bytesRead < 1024) {
            this.push(buf.slice(0, bytesRead))
          } else {
            this.push(buf)
          }
        })
        position += 1024
      }
    }
  })
}

exports.createWriteStream = function createWriteStream(path) {
  var fd = fs.openSync(path, '+')
  var position = 0
  return new Writable ({
    write(chunk, encoding, done) {
      fs.write(fd, chunk, 0, chunk.length, position, () => {
        done()
      })
      position += chunk.lengh
    }
  })
}