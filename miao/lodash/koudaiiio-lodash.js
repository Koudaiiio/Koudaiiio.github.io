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
        array.push(vals[i][0])
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
    for (var i = 0; i < array.length; i++) {
      var isdiff = true
      for (var j of values) {
        j.forEach(it => {
          if (it === array[i]) isdiff = false
        })
      }
      if (isdiff) result.push(array[i])
    }
    return result
  }


  return {
    chunk,
    compact,
    concat,
    difference,
  }
} ()