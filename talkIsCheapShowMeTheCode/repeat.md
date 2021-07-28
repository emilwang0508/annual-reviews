```js
Array.prototype._filter = (callback, thisArg) => {
    if (this === undefined) {
        throw new TypeError('')
    }

    if (typeof callback !== 'function') {
        throw new TypeError()
    }

    const res = []
    
    const obj = Object.create(this)
    
    const len = obj.length >>> 0

    for (let i = 0; i < len; i++) {
        if (i in obj) {
            if (callback.call(thisArg, obj[i], i, obj)) {
                res.push(Obj[i])
            }
        }
    }
    return res;
}
```

### Array.prototype.forEach()
```js
Array.prototype._forEach(callback, thisArg) {
    if (this === undefined) {
        throw new TypeError('')
    }

    if (typeof callback !== 'function') {
        throw new TypeError('')
    }

    const obj = Object.create(this)
    const len = obj.length >>> 0
    let i = 0;
    while (i < len) {
        if (i in obj) {
            callback.call(thisArg, obj[i], i, obj)
        }
        i++
    } 
}
```

### Array.prototype.reduce(callback, initVal)

```js
Array.prototype._reduce(callback, initVal) {
    if (this === undefined) {

    }
    if (typeof callback !== 'function') {

    }
    const obj = Object.create(this)
    const len = obj.length >>> 0

    let accumulator = initVal;
    let k = 0;

    if (accumulator === undefined) {
        while(k < len && !(k in obj)) {
            k++
        }
        if (k >= len) {
            throw new TypeError('')
        }
        accumulator = obj[k++]
    }

    while (k < len) {
        if (k in Obj) {
            accumulator = callback.call(undefined, accumulator, obj[k], k, obj)
        }
        k++
    }

    return accumulator
}
```

### Function.prototype.apply

```js
Function.prototype.apply = function(context = window, args) {
    if (typeof this !== 'function') {

    }

    const fn = Symbol('fn')

    context[fn] = this

    const res = context[fn](...args)

    delete context[fn]

    return res
}
```
### Function.prototype.call(context, ...args)

```js 
Function.prototype.call = function (context = window, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('')
    }

    const fn = Symbol('fn')

    context[fn] = this

    const res = context[fn](...args)

    delete context[fn]

    return res
}
```

### Function.prototype.bind(context, ...args)

```js
Function.prototype.bind = function(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('')
    }

    let self = this
    
    return function F() {
        // 考虑new的情况
        if (this instanceof F) {
            return new self(...args, ...arguments)
        }
        return self.apply(context, [...args, ...arguments])
    }
}
```

### debounce(防抖动)

```js
const debounce = (fn, await) => {
    let timer = null

    return function () {
        clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, await)
    }
}
```

### 函数柯里化

```js
// 柯里化通用版本
function curry (fn, args) {
    let length = fn.length
    let arg = args || []

    return function () {
        let newArgs = arg.concat(Array.prototype.slice.call(arguments))

        if (newArgs.length < length) {
            return curry.call(this, fn, newArgs)
        } else {
            return fn.apply(this, newArgs)
        }
    }
}
```
### 模拟new操作

```js
function newOperator(ctor, ...args) {
    if (typeof ctor !== function) {
        throw 
    }

    const obj = Object.create(ctor.prototype)
    const res = ctor.apply(obj, args)

    const isObject = typeof res === 'object' && res !== null
    const isFunction = typeof res === 'function'

    return isObject || isFunction ? res : obj
}
```

### instanceof

```js
const _instanceof = (left, right) => {
    // 基础类型都返回false
    if (typeof left !== 'object' || left === null) return false

    let proto = Object.getPrototypeOf(left)

    while(true) {
        if (proto === null) return false
        if (proto === right.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
}
```

### 寄生组合式继承

```js
function Parent(name) {
    this.name = name
}

Parent.prototype.sayName = function () {
    console.log('parent name: ', this.name)
}

function Child(name, parentName) {
    Parent.call(this, parentName)
    this.name = name
}

function create(proto) {
    function F() {}
    F.prototype = proto
    return new F();
}

Child.prototype = create(Parent.prototype)
Child.prototype.sayName = function () {
    console.log('child name: ', this.name)
}
Child.prototype.constructor = Child;

var parent = new Parent('father')
parent.sayName();

var child = new Child('son', 'father')
```
## 深拷贝
```js
const deepCoy = (obj) => {
    if (typeof !== 'object' || obj === null) {
        return obj
    }
    let result = obj.constructor === Array ? [] : {}

    for (let i in obj) {
        result[i] = typeof i === 'object' ? deepCopy(obj[i]) : obj[i]
    }

    return result
}
```

## Promise.all

```js
Promise._all = function (promiseArr) {
    return new Promise((resolve, reject) => {
        const ans = []
        let index = 0;

        for (let i = 0; i < promiseArr.length; i++) {
            promiseArr[i]
            .then(res => {
                ans[i] = res
                index++

                if (index === promiseArr.length) {
                    resolve(ans)
                }
            })
            .catch(err => reject(err))
        }
    })
}
```

## Promise并行限制

```js
class Scheduler {
    constructor (max) {
        this.queue = []
        this.maxCount = max || 2
        this.runCount = 0
    }

    add (promiseCreator) {
        this.queue.push(promiseCreator)
    }

    start() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request()
        }
    }

    request () {
        if (!this.queue || !this.queue.length || this.runCount >= this.maxCount) {
            return 
        }

        this.runCount++

        this.queue.shift()().then(() => {
            this.runCount--
            this.request()
        })
    }
}

const scheduler = new Scheduler()

scheduler.add()
scheduler.start()
```