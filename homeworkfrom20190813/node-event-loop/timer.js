const fs = require('fs')

fs.readFile('./timer.js', (err, info) => {
  setTimeout(() => {
    console.log(1)
  }, 0);
  
  setImmediate(() => {
    console.log(2)
  })

  process.nextTick(() => {
    console.log(3)
  })
})