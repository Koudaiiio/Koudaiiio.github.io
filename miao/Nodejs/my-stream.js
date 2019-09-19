const {Readable, Writable} = require('stream')

var myrs = new Readable ({
  read(size) {
    setTimeout(() => {
      var num = Math.random().toString()
      this.push(num)
    }, 200);
  }
})

var myws = new Writable({
  write(chunk, encoding, done) {
    setTimeout(() => {
      console.log(chunk.toString())
      done()
    }, 200);
  }
})


myrs.pipe(myws)
// myrs.on('data', data => {
//   console.log(data.toString())
// })