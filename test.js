/* eslint-disable no-shadow */
const assert = require('assert')
const onresize = require('./index')

let w, h, detached = {}, frame = 0, init = 0

function length(n) {
  return n == null ? ++init : n
}
function width(n) {
  return w = length(n)
}
function height(n) {
  return h = length(n)
}
function success(msg) {
  console.log('Test Passed! \t' + msg)
}

// test 1
function mockElement() {
  frame = 0
  return {
    get offsetWidth() { return width() },
    get offsetHeight() { return height() }
  }
}

mockElement.message = 'basic test, callback should called in the exact frame.'

// test2
function mockElement2(f) {
  frame = 0
  let w = 0, h = 0, t = ~~(Math.random() * (f - 1))
  // size only changed before penultimate frame.
  if (frame % f === t) {
    w = width(w - 1)
    h = height(h - 1)
  } else {
    width()
    height()
  }
  return {
    get offsetWidth() { return w },
    get offsetHeight() { return h }
  }
}

mockElement2.message = 'even size only changed before the penultimate in frame cycle, '
  + 'callback should be also called at the last frame(size equals to penultimate frame) in frame cycle.'

// @ts-ignore
global.window = {
  requestAnimationFrame(cb) {
    const id = length()
    setTimeout(() => {
      frame++
      if (detached[id]) return
      delete detached[id]
      // @ts-ignore
      cb()
    }, 10)
    return id
  },
  cancelAnimationFrame(id) {
    detached[id] = true
  }
}

function flow(...calls) {
  if (!calls.length) return
  const cancel = calls.shift()()
  setTimeout(() => {
    cancel()
    success(calls.shift())
    flow(...calls)
  }, 2000)
}

flow(
  // @ts-ignore
  () => onresize(mockElement(), { frame: 10 }, (size) => {
    assert.equal(w, size.width, 'expect callback size param to be the last size.')
    assert.equal(h, size.height, 'expect callback size param to be the last size.')
    assert.equal(frame % 10, 0, 'called in unexpected frame: ' + frame)
  }),
  mockElement.message,
  // @ts-ignore
  () => onresize(mockElement2(20), { frame: 20 }, (size) => {
    assert.notEqual(w, size.width, 'unexpected size')
    assert.notEqual(h, size.height, 'unexpected size')
    assert.equal(frame % 20, 0, 'called in unexpected frame: ' + frame)
  }),
  mockElement2.message
)
