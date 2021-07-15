define('b', function(require, exports, module) {
    console.log('b loaded')
    exports.run = function () { console.log('b run')}
})
