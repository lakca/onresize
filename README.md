# onresize

> Listen on the change of HTML Element.

## Usage

> By default, listen on the size change of element.

```js
const onresize = require('@lakca/onresize')
onresize(document.body, size => {
  console.log(size.width) // offsetWidth
  console.log(size.height) // offsetHeight
})
```

> Change default triggering frame(30) interval.

```js
onresize(document.body, { frame: 60 }, ...)
```

> Custom `getSize` and `equal` to listen on changes of other properties.

```js
onresize(document.body, {
  getSize(el) {
    const pos = el.getBoundingClientRect()
    return {
      x: el.top,
      y: el.left
    }
  },
  equal(a, b) {
    return a.x === b.x && a.y === b.y
  }
}, ...)
```

## API

### `onresize(HTMLElement, [options], callback)`

#### options.frame [number: 30]

> it uses `window.requestAnimationFrame` to conduct periodic detection of element changes.

> **The comparing operands are data retrieved in every adjacent triggering frame.**

> see [`window.requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

#### options.getSize [function=defaultGetSize]

```js
function defaultGetSize(ele) {
  return {
    width: ele.offsetWidth,
    height: ele.offsetHeight
  }
}
```

> By default, the program listens on element layout size changing, you can provide `options.getSize` and `options.equal` to change retrieved data and comparing method, such as position of element.

#### options.equal [function=defaultEqual]

```js
function defaultEqual(one, other) {
  return one.width === other.width && one.height === other.height
}
```

> Also, you can listen on any change that is related to screen refreshing.

## LICENSE

MIT
