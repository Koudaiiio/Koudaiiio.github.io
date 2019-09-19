module.exports = function() {
  return (req, res, next) => {
  var str = ''
  req.on('data', data => {
    str += data.toString()
  })
  req.on('end', () => {
    if (req.is('json')) {
      req.body = JSON.parse(str)
    } else if (req.is('urlencoded')) {
      req.body = url.parse(str)
    } else {
      req.body = str
    }
    next()
  })
}}