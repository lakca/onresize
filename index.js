/**
 * add listener on change of element layout size.
 *
 * @author lakca<912910011@qq.com>
 * @param {HTMLElement} ele
 * @param {object} [opts]
 * @param {number} [opts.frame=30]
 * @param {function} [opts.getSize=getSize] see default value below
 * @param {function} [opts.equal=equal] see default value below
 * @param {function} cb
 * @returns {function} remove the listener.
 */
module.exports = function onresize(ele, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  opts = Object.assign({ frame: 30, getSize, equal }, opts)
  let prevSize = opts.getSize(ele)
  let handler = frame()
  let count = 0
  return function cancel() {
    window.cancelAnimationFrame(handler)
  }
  function frame() {
    return window.requestAnimationFrame(function() {
      handler = frame()
      if (++count < opts.frame) {
        return
      } else {
        count %= opts.frame
      }
      const size = opts.getSize(ele)
      try {
        if (!opts.equal(prevSize, size))
          cb(size)
      } finally {
        prevSize = size
      }
    })
  }
}

function getSize(ele) {
  return {
    width: ele.offsetWidth,
    height: ele.offsetHeight
  }
}

function equal(one, other) {
  return one.width === other.width && one.height === other.height
}
