var fs = require('fs')
  , fsp = fs.promises


function listAllFilesSync(path) {
  var result = []
  if (fs.statSync(path).isFile()) {
    return [path]
  } else {
    var filenames = fs.readdirSync(path)
    filenames.forEach(name => {
      result.push(...listAllFilesSync(path + '/' + name))
    })
  }
  return result
}

function listAllFilesCallback(path, callback) {
  var result = []
  fs.stat(path, (err, info) => {
    if (info.isFile()) {
      callback([path])
    } else {
      fs.readdir(path, (err, info) => {
        if (info.length == 0) {
          callback([])
        } else {
          var count = 0
          info.forEach((name, idx) => {
            listAllFilesCallback(path + '/' + name, function (ary){
              result[idx] = ary
              count++
              if (info.length == count) {
                callback([].concat(...result))
              }
            })
          })
        }
      })
    }
  })
}

function listAllFilesPromise(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, name) => {
      if (name.isFile()) {
        resolve([path])
      } else {
        fs.readdir(path, (err, names) => {
          var result = []
            , count = 0
          names.forEach(name => {
            listAllFilesPromise(path + '/' + name).then(val => {
              result.push(...val)
              count++
              if (count == names.length) {
                resolve(result)
              }
            })
          })
        })
      }
    })
  })
}