define('a', ['lodash'], function(_, a) {
    console.log('module loaded')

    return {
        str: function () {
            console.log('a module loaded')
            return _.repeat('>>>>>>>>>>', 20)
        }
    }
    
});         