const defaultOptions = {
    paths: ''
}

const def = new Map()

requireJs = {}
requireJs.config = (options) => Object.assign(defaultOptions, options)

define = (name, deps, factory) => {
    def.set(name, {name, deps, factory})
}

// 引入cdn js
const __import = (dep) => {
    return new Promise((resolve, reject) => {
        System.import(dep).then(resolve, reject)
    })
}

const __load = (url) => {
    return new Promise((resolve, reject) => {
        const head = document.getElementsByTagName('head')[0]
        const node = document.createElement('script')
        node.type = 'text/javascript'
        node.src = url
        node.async = true
        node.onload = resolve
        node.onerror = reject
        head.appendChild(node)
    })
}

const __getUrl = (dep) => {
    let p = location.pathname
    return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}


require = (deps, factory) => {
    return new Promise((resolve, reject) => {
        Promise.all(
            deps.map( dep => {
                // 存在cdn配置，加载cdn js
                if (defaultOptions.paths[dep]) return __import(defaultOptions.paths[dep])
            
                return __load(__getUrl(dep)).then(() => {
                    const { deps, factory } = def.get(dep)

                    if (deps.length ===0) return factory(null)
                    return require(deps, factory)
                })
            })
        ).then(resolve, reject)
    }).then(instance => factory(...instance))
}