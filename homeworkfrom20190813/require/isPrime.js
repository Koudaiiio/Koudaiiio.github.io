module.exports = function(n) {
  for (var i = 2; i <= n / 2; i++) {
    if (n % i == 0) return false
  }
  return true
}