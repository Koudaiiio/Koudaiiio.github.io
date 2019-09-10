var koudaiiio = function () {
  /**
   * [chunk description]
   *
   * @param   {Array}  ary   [ary description]
   * @param   {Number}  size  [size description]
   *
   * @return  {Array}        [return description]
   */
  function chunk(ary, size = 1) {
    var result = []
      , i = 0
    while (i + size <= ary.length) {
      var a = []
      for (var j = 0; j < size; j++) {
        a.push(ary[i++])
      }
      result.push(a)
    }
    if (i < ary.length) result.push(ary.slice(i))
    return result
  }


  /**
   * [compact description]
   *
   * @param   {Array}  ary  [ary description]
   *
   * @return  {Array}       [return description]
   */
  function compact(ary) {
    var result = []
    for (var i = 0; i < ary.length; i++) {
      if (ary[i]) result.push(ary[i])
    }
    return result
  }


  /**
   * [concat description]
   *
   * @param   {Array}  array    [array description]
   * @param   {Number|Array}  ...vals  [...vals description]
   *
   * @return  {Array}           [return description]
   */
  function concat(array, ...vals) {
    for (var i in vals) {
      if (Array.isArray(vals[i])) {
        for (var j of vals[i]) {
          array.push(j)
        }
      } else {
        array.push(vals[i])
      }
    }
    return array
  }
  
  /**
   * [difference description]
   *
   * @param   {Array}  array      [array description]
   * @param   {Array}  ...values  [...values description]
   *
   * @return  {Array}             [return description]
   */
  function difference(array, ...values) {
    var result = []
    var c = flattenDeep(values)
    for (var i of array) {
      if (c.indexOf(i) === -1) result.push(i)
    }
    return result
  }

  /**
   * [differenceBy description]
   *
   * @param   {Array}  array    [array description]
   * @param   {Array|Number|String}  ...rest  [...rest description]
   *
   * @return  {Array}           [return description]
   */
  function differenceBy(array, ...rest) {
    var last = rest.pop()
      , result = []
      , ary = []
    if (typeof last === 'function') {
      ary = flatten(rest).map(it => last(it))
      for (var i of array) {
        if (ary.indexOf(last(i)) === -1) result.push(i)
      }
    } else if (typeof last === 'string') {
      ary = flatten(rest).map(it => it[last])
      for (var i of array) {
        if (ary.indexOf(i[last]) === -1) result.push(i)
      }
    } else {
      rest.push(last)
      return difference(array, rest)
    }
    return result
  }

  function differenceWith(array, values, compare) {
    var result = []
    for (var i in array){
      var isdiff = false
      for (var j in values) {
        if (compare(array[i], values[j])) {
          isdiff = true
          break
        }
      }
      if (isdiff == false) {
        result.push(array[i])
      }
    }
    return result
  }
  
  function drop(array, n = 1) {
    return array.slice(n)
  }

  function dropRight(array, n = 1) {
    return array.slice(0, Math.max(0, array.length - n))
  }
  
  function dropRightWhile(array, fuc) {
    fuc = iteratee(fuc)
    for (var i = array.length - 1; i >= 0; i--) {
      if (fuc(array[i])) {
        array.pop()
      } else {
        break
      }
    }
    return array
  }
  
  function dropWhile(array, fuc) {
    fuc = iteratee(fuc)
    for (var i = 0; i < array.length; i++) {
      if (fuc(array[i])) {
        array.shift()
        i--
      } else {
        break
      }
    }
    return array
  }
  

  function fill(array, value, start = 0, end = array.length) {
    for(var i = start; i < end; i++) {
      array[i] = value
    }
    return array
  }

  function findIndex(array, fuc, fromIndex = 0) {
    fuc = iteratee(fuc)
    for (var i = fromIndex; i < array.length; i++) {
      if (fuc(array[i])) {return i}
    }
    return -1
  }

  function findLastIndex(array, fuc, fromIndex = array.length - 1) {
    fuc = iteratee(fuc)
    for (var i = fromIndex; i >= 0; i--) {
      if (fuc(array[i])) {return i}
    }
    return -1
  }

  /**
   * [flatten description]
   *
   * @param   {Array}  array  [array description]
   *
   * @return  {Array}         [return description]
   */
  function flatten(array) {
    var result = []
    for (var i of array) {
      if (Array.isArray(i)) {
        for (var j of i) result.push(j)
      } else {
        result.push(i)
      }
    }
    return result
  }

  /**
   * [flattenDeep description]
   *
   * @param   {Array}  array  [array description]
   *
   * @return  {Array}         [return description]
   */
  function flattenDeep(array) {
    var result = array
    while(1) {
      var isflatterned = true
      for (var i of result) {
        if (Array.isArray(i)) {
          result = flatten(result)
          isflatterned = false
        }
      }
      if (isflatterned) break
    }
    return result
  }

  /**
   * [flattenDepth description]
   *
   * @param   {Array}  array  [array description]
   * @param   {Number}  depth  [depth description]
   *
   * @return  {Array}         [return description]
   */
  function flattenDepth(array, depth = 1) {
    var result = array
    for (var i = 0; i < depth; i++) {
      result = flatten(result)
    }
    return result
  }


  function fromPairs(pairs) {
    var obj = {}
    for (var i of pairs) {
      obj[i[0]] = i[1]
    }
    return obj
  }

  function head(array) {
    if (array.length) {
      return array[0]
    }
    return undefined
  }

  function indexOf(array, value, fromIndex = 0) {
    if (isNaN(value)) {
      for (var i = fromIndex; i < array.length; i++) {
        if (isNaN(array[i])) return i
      }
    }
    for (var i = fromIndex; i < array.length; i++) {
      if (array[i] == value) return i
    }
    return -1
  }

  function initial(array) {
    if (array.length <= 1) return []
    return array.slice(0, -1)
  }

  function intersection(...array) {
    if (array.length == 1) return array[0]
    var ary = []
    for (var j of array[0]) {
      for (var i = 1; i < array.length; i++) {
        if (array[i].indexOf(j) == -1) break
        if (i == array.length - 1) ary.push(j)
      }
    }
    return ary
  }

  function join(array, separator = ',') {
    if (array.length == 0) return ''
    if (array.length == 1) return array[0]
    var str = ''
    for (var i = 0; i < array.length - 1; i++) {
      str += '' + array[i] + separator
    }
    return str + array[array.length - 1]
  }

  function last(array) {
    return array[array.length - 1]
  }

  function lastIndexOf(array, value, fromIndex = array.length - 1) {
    if (isNaN(value)) {
      for (var i = fromIndex; i >= 0; i--) {
        if (isNaN(array[i])) return i
      }
    }
    for (var i = fromIndex; i >= 0; i--) {
      if (array[i] == value) return i
    }
    return -1
  }

  function nth(array, n = 0) {
    if (n >= 0) {
      return array[n]
    } else {
      return array[array.length + n]
    }
  }

  function pull(array, ...values) {
    for (var i = 0; i < array.length; i++) {
      if (values.indexOf(array[i]) >= 0) {
        array.splice(i, 1)
        i--
      }
    }
    return array
  }

  function pullAll(array, values) {
    for (var i = 0; i < array.length; i++) {
      if (values.indexOf(array[i]) >= 0) {
        array.splice(i, 1)
        i--
      }
    }
    return array
  }

  function pullAllBy(array, values, fuc) {
    fuc = iteratee(fuc)
    for (var i = 0; i < array.length; i++) {
      for (var j of values) {
        if (fuc(array[i]) == fuc(j)) {
          array.splice(i--, 1)
          break
        }
      }
    }
    return array
  }

  function pullAllWith(array, values, comparator) {
    for (var i = 0; i < array.length; i++) {
      for (var j of values) {
        if (comparator(array[i], j)) {
          array.splice(i--, 1)
          break
        }
      }
    }
    return array
  }

  function pullAt(array, ...indexes) {
    var ary = []
      , temp = 0
    if (isArray(indexes[0])) indexes = flattenDeep(indexes)
    for (var i of indexes) {
      ary.push(array[i - temp++])
      temp--
      array.splice(i - temp++, 1)
    }
    return ary
  }

  function remove(array, fuc) {
    var ary = []
    for (var i = 0; i < array.length; i++) {
      if (fuc(array[i])) {
        ary.push(array[i])
        array.splice(i--, 1)
      }
    }
    return ary
  }

  function reverse(array) {
    var ary = []
    for (var i of array) {
      ary.unshift(i)
    }
    return ary
  }

  function sortedIndex(array, value) {
    if (array.length == 0) return 0
    if (value <= array[0]) return 0
    if (value > array[array.length - 1]) return array.length
    for (var i = 1; i < array.length; i++) {
      if (value > array[i - 1] && value <= array[i]) return i
    }
  }

  function sortedIndexBy(array, value, fuc) {
    fuc = iteratee(fuc)
    var ary = array.map(it => fuc(it))
    var val = fuc(value)
    return sortedIndex(ary, val)
  }

  function sortedIndexOf(array, value) {
    return indexOf(array, value)
  }

  function sortedLastIndex(array, value) {
    if (array.length == 0) return 0
    if (value <= array[0]) return 0
    if (value > array[array.length - 1]) return array.length
    for (var i = array.length - 1; i >= 0; i--) {
      if (value >= array[i - 1] && value < array[i]) return i
    }
  }

  function sortedLastIndexBy(array, value, fuc) {
    fuc = iteratee(fuc)
    var ary = array.map(it => fuc(it))
      , val = fuc(value)
    return sortedLastIndex(ary, val)
  }

  function sortedLastIndexOf(array, value) {
    return lastIndexOf(array, value)
  }

  function sortedUniq(array) {
    var ary = [array[0]]
    for (var i = 1; i < array.length; i++) {
      if (array[i] != ary[ary.length - 1]) ary.push(array[i])
    }
    return ary
  }

  function sortedUniqBy(array, fuc) {
    fuc = iteratee(fuc)
    var ary = [array[0]]
    for (var i = 1; i < array.length; i++) {
      if (fuc(array[i]) != fuc(ary[ary.length - 1])) ary.push(array[i])
    }
    return ary
  }

  function tail(array) {
    return array.slice(1)
  }

  function take(array, n = 1) {
    return array.slice(0, n)
  }

  function takeRight(array, n = 1) {
    return array.slice(Math.max((array.length - n), 0)
  }

  function takeRightWhile(array, fuc) {
    fuc = iteratee(fuc)
    var j = 0
    for (var i = array.length - 1; i >= 0; i--) {
      if (fuc(array[i], i, array)) {
        j++
      } else {
        break
      }
    }
    return array.slice(Math.max(0, array.length - j))
  }

  function takeWhile(array, fuc) {
    fuc = iteratee(fuc)
    for (var i = 0; i < array.length; i++) {
      if (!fuc(array[i], i, array)) {
        return array.slice(0, i)
      }
    }
    return array.slice()
  }

  function union(...arrays) {
    var ary = arrays[0]
    for (var i = 1; i < arrays.length; i++) {
      for (var j of arrays[i]) {
        if (ary.indexOf(j) == -1) {
          ary.push(j)
        }
      }
    }
    return ary
  }

  function unionBy(...arrays, fuc) {
    fuc = iteratee(fuc)
    var ary = arrays[0]
      , mapary = ary.map(it => fuc(it))
    for (var i = 1; i < arrays.length; i++) {
      for (var j of arrays[i]) {
        if (mapary.indexOf(fuc(j) == -1)) {
          ary.push(j)
          mapary.push(fuc(j))
        }
      }
    }
    return ary
  }

  function unionWith(...arrays, comparator) {
    var ary = arrays[0]
    for (var i = 1; i < arrays.length; i++) {
      for (var j of arrays[i]) {
        var uni = true
        for (var k of ary) {
          if (comparator(j, k)) {
            uni = false
            break
          }
        }
        if (uni) {ary.push(j)}
      }
    }
    return ary
  }

  function uniq(array) {
    var ary = []
    for (var i of array) {
      if (ary.indexOf(i) == -1) {
        ary.push(i)
      }
    }
    return ary
  }

  function uniqBy(array, fuc) {
    fuc = iteratee(fuc)
    var ary = []
      , mapary = []
    for (var i of array) {
      if (mapary.indexOf(fuc(i)) == -1) {
        ary.push(i)
        mapary.push(fuc(i))
      }
    }
    return ary
  }

  function uniqWith(array, comparator) {
    var ary = [array[0]]
    for (var i = 1; i < array.length; i++) {
      var isMap = false
      for (var j of ary) {
        if (comparator(array[i], j)) {
          isMap = true
          break
        }
      }
      if (!isMap) {
        ary.push(array[i])
      }
    }
  }

  function unzip(array) {
    var ary = []
    for (var i = 0; i < array[0].length; i++) {
      var part = []
      for (var j of array) {
        part.push(j[i])
      }
      ary.push(part)
    }
    return ary
  }

  function unzipWith(array, fuc) {
    fuc = iteratee(fuc)
    var ary = []
    for (var i = 0; i < array[0].length; i++) {
      ary.push(fuc(array[0][i], array[1][i]))
    }
    return ary
  }

  function without(array, ...values) {
    var ary = []
    for (var i of array) {
      if (values.indexOf(i) == -1) {
        ary.push(i)
      }
    }
    return ary
  }








  function isArguments(value) {
    return Object.prototype.toString.call(value) === '[object Arguments]'
  }

  function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]'
  }

  function isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]'
  }

  function isDate(val) {
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  function isElement(val) {
    return /Element/.test(Object.prototype.toString.call(val))
  }

  function isEmpty(val) {
    if (!val) return true
    for (var i in val) {return false}
    return true
  }

  function isEqual(value, other) {
    if (value == other) return true
    if (isNaN(value) && isNaN(other)) return true
    if ((isFunction(value) && isFunction(other)) || (isRegExp(value) && isRegExp(other))) {
      return value.toString() === other.toString()
    }
    if (isObjectLike(value) && isObjectLike(other)) {
      var valuekeys = Object.keys(value)
        , otherkeys = Object.keys(other)
      if (valuekeys.length != otherkeys.length) {return false}
      for (var i in value) {
        if (!isEqual(value[i], other[i])) return false
      }
    }
    return value == other
  }

  function isEqualWith(value, other, customizer) {
    if (customizer == undefined) return isEqual(value, other)
    if (typeof value != typeof other) return false
    if (isObjectLike(value) && isObjectLike(other)) {
      for (var i in value) {
        for (var j in other) {
          if (customizer(value[i], other[j])) return true
        }
      }
    }
    return customizer(value, other) == true
  }










  function isObject(val) {
    return val !== null && typeof val == 'object' || typeof val == 'function'
  }

  function isObjectLike(val) {
    return val !== null && typeof val == 'object'
  }

  function isPlainObject(val) {
    if (!val) return false
    return val.__proto__ == undefined || val.__proto__.constructor.name == 'Object'
  }

  function isRegExp(val) {
    return Object.prototype.toString.call(val) == '[object RegExp]'
  }

  function isString(val) {
    return Object.prototype.toString.call(val) =='[object String]'
  }

  function isFunction(val) {
    return Object.prototype.toString.call(val) == '[object Function]'
  }

  function isNaN(val) {
    if (val != undefined && val != null) {
      return  val.toString() == 'NaN'
    }
    return false
  }

  function isNumber(val) {
    return Object.prototype.toString.call(val) == '[object Number]'
  }


  function property(arg) {
    if (typeof arg != 'string' && !Array.isArray(arg)) return 'Invalid argument'
    if (typeof arg == 'string')
      arg = arg.split('.')
    return function(obj) {
      for (var i of arg) {
        obj = obj[i]
      }
      return obj
    }
  }

  function matchesProperty(path, srcValue) {
    return function(obj) {
      return property(path)(obj) == srcValue
    }
  }
  

  function isMatch(object, source) {
    if (object == source) return true
    for (var i in source) {
      if (typeof source[i] == 'object') {
        return isMatch(object[i], source[i])
      } else {
        if (object[i] != source[i]) return false
      }
    }
    return true
  }

  function matches(source) {
    return function(obj) {
      return isMatch(obj, source)
    }
  }


  function iteratee(val) {
    if (isString(val) || isNumber(val)) {
      return property(val)
    }
    if (isArray(val)) {
      return function(obj) {
        var ismap = true
        for (var i = 0; i < val.length; i+=2) {
          ismap = ismap && matchesProperty(val[i], val[i + 1])(obj)
        }
        return ismap
      }
    }
    if (isPlainObject(val)) {
      return matches(val)
    }
    return val
  }


  return {
    chunk,
    compact,
    concat,
    difference,
    differenceBy,
    differenceWith,
    drop,
    dropRight,
    dropRightWhile,
    dropWhile,
    fill,
    findIndex,
    findLastIndex,
    flatten,
    flattenDeep,
    flattenDepth,
    fromPairs,
    head,
    indexOf,
    initial,
    intersection,
    join,
    last,
    lastIndexOf,
    nth,
    pull,
    pullAll,
    pullAllBy,
    pullAllWith,
    pullAt,
    remove,
    reverse,
    sortedIndex,
    sortedIndexBy,
    sortedIndexOf,
    sortedLastIndex,
    sortedLastIndexBy,
    sortedLastIndexOf,
    sortedUniq,
    sortedUniqBy,
    tail,
    take,
    takeRight,
    takeRightWhile,
    takeWhile,
    union,
    unionBy,
    unionWith,
    uniq,
    uniqBy,
    uniqWith,
    unzip,
    unzipWith,
    without,

    
    isArguments,
    isArray,
    isBoolean,
    isDate,
    isElement,
    isEmpty,
    isEqual,
    isEqualWith,
    isObject,
    isObjectLike,
    isPlainObject,
    isRegExp,
    property,
    matchesProperty,
    isMatch,
    matches,
    iteratee,
  }
} ()