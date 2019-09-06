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
    var isdiff = false
      , result = []
    for (var i in array){
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
    // if
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


  return {
    chunk,
    compact,
    concat,
    difference,
    differenceBy,
    differenceWith,
    drop,
    dropRight,
    flatten,
    flattenDeep,
    flattenDepth,
    isArguments,
    isArray,
    isBoolean,
    isDate,
    isElement,
    isEmpty,
    isObject,
    isObjectLike,
    isPlainObject,
    isRegExp,
    property,
    matchesProperty,
    isMatch,
    matches,
  }
} ()