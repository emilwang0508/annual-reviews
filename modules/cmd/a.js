define('a', function(require, exports, module) {
    console.log('a loaded')
    exports.run = function () { console.log('a run')}
})