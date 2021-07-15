```js
define('a', function(require, exports, module)) {
    console.log('a loaded')
    exports.run = function () { console.log('a run')}
}

define('b', function(require, exports, module)) {
    console.log('b loaded')
    exports.run = function () { console.log('b run')}
}

define('main', function(require, exports, module)) {
    console.log('main loaded')
    var a = require('a')
    a.run()
    var b = require('b')
    b.run()
}
seajs.use('main')
```