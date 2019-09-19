function require(path) {
  if (require.moduleCache.hasOwnProperty(path)) {
    return require.moduleCache[path]
  }

  var code = readFile(path)
  var modFun = new Function('module, exports', code)

  var module = {exports: {}}

  require.moduleCache[path] = module.exports

  var returnValue = modFun(module, module.exports)
  if (returnValue === undefined) {
    require.moduleCache[path] = module.exports
  } else {
    require.moduleCache[path] = returnValue
  }
  return require.moduleCache[path]
}

require.moduleCache = new Object()

function readFile(path) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', path, false)
  xhr.send()
  return xhr.responseText
}