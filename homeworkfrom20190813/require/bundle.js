{
  "main.js": "function anonymous(require, exports, module
) {
var isPrime = require('isPrime.js')
var isnarcissistic = require('isnarcissistic.js')

for (var i = 2; i <= 1000; i++) {
  if (isPrime(i)) console.log(i)
}
}",
  "isPrime.js": "function anonymous(require, exports, module
) {
module.exports = function(n) {
  for (var i = 2; i <= n / 2; i++) {
    if (n % i == 0) return false
  }
  return true
}
}",
  "isnarcissistic.js": "function anonymous(require, exports, module
) {
var digitwidth = require('digitWidth.js')
var power = require('power.js')

module.exports = function(n) {
  var w = digitwidth(n)
    , sum = 0
    , num = n
  while (num) {
    var d = num % 10
    sum += power(d, w)
    num = (num - d) / 10
  }
  return n === sum
}
}",
  "digitWidth.js": "function anonymous(require, exports, module
) {
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
}",
  "power.js": "function anonymous(require, exports, module
) {
module.exports = function(x, y) {
  return Math.pow(x, y)
}
}"
}