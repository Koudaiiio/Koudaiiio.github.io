var fs = require('fs').promises//返回Promise

var util = require('util')
util.promisify() //此即为封装好的promisify

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function writeFilePromise(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// 将一个基于回调的函数转化为一个返回 promise 的函数

function promisify(f) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      f(...args, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}

function callbackify(promiseBased) {
  return function(...args) {
    var cb = arys.pop()
    promiseBased(...args).then(val => {
      cb(null, val)
    }, reason => {
      cb(reason)
    })
  }
}



/**
 * 接收一个文件夹路径，返回这个文件夹里面的所有文件名
 * 需要递归的得到所有的文件名 并放在一个一维数组里返回
 * 需要写三个版本：
 * 同步版
 * 回调版
 * Promise版本
 */

 
var fs = require('fs')
var fsp = fs.promises


function listAllFilesSync(dirPath) {
  var ary = fs.readdirSync(dirPath)
  ary.forEach(it => {
    if (fs.statSync(dirPath + it).isDirectory()) {
      ary = ary.concat(listAllFilesSync(dirPath + it + '/'))
    }
  })
  return ary
}

function listAllFilesSync(path) {
  var result =  []
  var stat = fs.statSync(path)
  if (stat.isFile()) {
    return [path]
  } else {
    var names = fs.readdirSync(path)
    names.forEach(name => {
      var fullPath = path + '/' + name
      var stat = fs.statSync(fullPath)
      if (stat.isFile()) {
        result.push(fullPath)
      } else {
        var files = listAllFilesSync(fullPath)
        result.push(...files)
      }
    })
  }
}

function listAllFilesCallback(dirPath, cb) {
  var ary
  fs.readdir(dirPath, (err, info) => {
    if (err) {
      throw err
    } else {
      ary = info
      ary.forEach(it => {
        fs.stat(dirPath + it, (err, result) => {
          if (result.isDirectory()) {
            ary = ary.concat(listAllFilesCallback(dirPath + it + '/', cb))
          }
        })
      })
    }
  })
  return ary
}

function listAllFilesCallback(dirPath, cb) {
  var ary = []
  fs.readdir(dirPath, (err, info) => {
    ary.concat(info)
    cb(listAllFilesCallback)
  })
}

listAllFilesCallback(dirPath, f = function(err, files) {
  console.log(files)
  files.forEach(it => {
    listAllFilesCallback(__filename + it + '/', f)
  })
})

function listAllFilesPromise(dirPath) {
  return new Promise((resolve, reject) => {
    var ary = []
      , count = 0
    fs.readdir(dirPath, (err, info) => {
      var le = info.length
      ary = ary.concat(info)
      info.forEach(path => {
        count++
        fs.stat(dirPath + path, (err, info) => {
          if (info.isDirectory()) {
            listAllFilesPromise(dirPath + path + '/').then(val => {
              ary = ary.concat(val)
            })
          }
          if (count == le) {
            resolve(ary)
          }
        })
      })
    })
  })
}


var files = listAllFiles('c:/')

listAllFilesCallback('c:/', (err, files) => {

})

listAllFilesPromise('c:/').then(files => {

}, err => {

})



