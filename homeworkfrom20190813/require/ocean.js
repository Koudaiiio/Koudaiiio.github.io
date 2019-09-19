(function () {

  var seajs = {
    use: function(entryPath) {
      loadAll(entryPath, () => {
        require(entryPath)
      })
    }
  }

  window.seajs = seajs

  function require(path) {
    if (moduleCache[path]) {
      return moduleCache[path]
    }
    var code = cache[path]
    var modFunc = new Function('module, exports, require', code)
    var module = {exports:{}}
    modFunc(module, module.exports, require)
    moduleCache[path] = module.exports
    return module.exports
  }

  var cache  = {}
  var moduleCache = {}

  function loadAll(path, callback) {
    readFile(path, code => {
      cache[path] = code
      var deps = getDepends(code)
      if (deps.length === 0) {
        callback()
        return
      }
      var count = 0
      deps.forEach(dep => {
        loadAll(dep, () => {
          count++
          if (count == deps.length) {
            callback()
          }
        })
      })
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


  function readFile(path, done) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', path)
    xhr.addEventListener('load', () => {
      done(xhr.responseText)
    })
    xhr.send()
  }
}())