const defaultOptions = {
    paths: ''
}

const def = new Map()

requireJs = {}
requireJs.config = (options) => Object.assign(defaultOptions, options)


const __import = (url) => {
    return new Promise((resolve, reject) => { 
        System.import(url).then(resolve, reject)
    })
}

const __load = (url) => {
    return new Promise((resolve, reject) => {
        const head   = document.getElementsByTagName('head')[0]
        const node   = document.createElement('script')
        node.type    = 'text/javascript'
        node.src     = url
        node.async   = true
        node.onload  = resolve
        node.onerror = reject
        head.appendChild(node)
    })
}

const __getUrl = (url) => {
    const p = location.pathname
    return p.slice(0, p.lastIndexOf('/')) + '/' + url + '.js'
}

define = (name, deps, factory) => {
    def.set(name, {name, deps, factory})
}

require = (deps, factory) => {
    return new Promise((resolve, reject) => {
        Promise.all(
            deps.map( dep => {
                // 引入CDN
                if (defaultOptions.paths[dep]) return __import(defaultOptions.paths[dep])

                // 引入相对路径js
                return __load(__getUrl(dep)).then(() => {
                    const { deps, factory } = def.get(dep)
                    if (deps.length === 0) return factory(null)
                    return require(deps, factory)
                })
            })
        ).then(resolve, reject)

    }).then(instances => factory(...instances))
}


