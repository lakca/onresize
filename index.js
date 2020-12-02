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
  let currentSize = opts.getSize(ele)
  let handler = frame()
  let count = 0
  exec(currentSize)
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
      exec(opts.getSize(ele), currentSize)
    })
  }
  function exec(size, lastSize) {
    try {
      if (!opts.equal(lastSize, size)) {
        cb(size)
      }
    } finally {
      lastSize = size
    }
  }
}

function getSize(ele) {
  return {
    width: ele.offsetWidth,
    height: ele.offsetHeight
  }
}

function equal(one, other) {
  if (one && other) {
    return one.width === other.width && one.height === other.height
  } else {
    return false
  }
}
