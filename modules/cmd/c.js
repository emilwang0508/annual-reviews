define('c', function(require, exports, module) {
    console.log('c loaded')
    exports.run = function () { console.log('b run')}
})
