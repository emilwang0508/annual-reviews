define('main', async function(require, exports, module) {
    console.log('main loaded')
    var a = await require('a')
    a.run()
    var b = await require('b')
    b.run()
})