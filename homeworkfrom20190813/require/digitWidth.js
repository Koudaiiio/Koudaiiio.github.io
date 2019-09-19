module.exports = function(n) {
  if (n == 0) {
    return 1
  } else {
    var w = 0
    while (n) {
      w++
      n = Math.floor(n / 10)
    }
  }
  return w
}