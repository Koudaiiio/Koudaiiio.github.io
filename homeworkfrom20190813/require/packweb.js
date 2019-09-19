var fs = require('fs')

var entry = 'main.js'

var modFuncCache = {}

loadAll(entry)

var modulesMapSource = JSON.stringify(modFuncCache, function(key, val) {
  if (typeof val === 'function') {
    return "########" + val.toString() + "########"
  } else {
    return val
  }
}, 2).replace(/"########|########"/g, '')
.replace(/\\n/g, '\n')
.replace(/\\r/g, '\r')

fs.writeFileSync('bundle.js', modulesMapSource)

function loadAll(path) {
  var code = fs.readFileSync(path).toString()
  var modFunc = new Function('require, exports, module', code)
  modFuncCache[path] = modFunc
  var deps = getDepends(code)
  deps.forEach(dep => {
    loadAll(dep)
  })
}

function getDepends(code) {
  var requires = code.match(/require\s*\(\s*['"]\s*[^'" ]*\s*['"]\s*\)/g)
  if (requires) {
    return requires.map(require => {
      return require.match(/require\s*\(\s*['"]\s*([^'" ]*)\s*['"]\s*\)/)[1]
    })
  } else {
    return []
  }
}