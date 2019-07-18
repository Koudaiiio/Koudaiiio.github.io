var koudaiiio = function () {
  /**
   * [chunk description]
   *
   * @param   {[type]}  ary   [ary description]
   * @param   {[type]}  size  [size description]
   *
   * @return  {[type]}        [return description]
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
   * @param   {[type]}  ary  [ary description]
   *
   * @return  {[type]}       [return description]
   */
  function compact(ary) {
    var result = []
    for (var i = 0; i < ary.length; i++) {
      if (ary[i]) result.push(ary[i])
    }
    return result
  }



  
  return {
    chunk,
    compact,
  }
} ()