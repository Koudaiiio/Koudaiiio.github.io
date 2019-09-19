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