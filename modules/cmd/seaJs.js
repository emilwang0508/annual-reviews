const modules = {}
const exports = {}
seaJs = {}

// 拼接地址
const toUrl = (dep) => {
    const p = location.pathname
    return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}

const getDepsFromFn = (fn) => {
    let matches = []
    let reg = /(?:require\()(?:['"])([^'"]+)/g
    let res = null
    while((res = reg.exec(fn.toString())) !== null) {
        reg.lastIndex
        matches.push(res[1])
    }
    return matches
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

// 依赖呢？
// 1. 正则表达式 2. 状态机
define = (id, factory) => {
    const url = toUrl(id)
    const deps = getDepsFromFn(factory)
    if (!modules[id]) {
        modules[id] = {url, id, factory, deps}
    }
}

const __exports = (id) => exports[id] || (exports[id] = {})
const __module = this
// 这里才是加载模块的地方
const __require = (id) => {
    return __load(toUrl(id)).then(() => {
        // 加载之后
        const {factory, deps} = modules[id]
        if (!deps || deps.length === 0) {
            factory(__require, __exports(id), __module)
            return __exports(id)
        }
        return seaJs.use(deps, factory)
    })
}

seaJs.use = (mods, callback) => {
    mods = Array.isArray(mods) ? mods : [mods]
    return new Promise((resolve, reject) => {
        Promise.all(mods.map(mod => {
            return __load(toUrl(mod)).then(() => {
                const { factory } = modules[mod]
                return factory(__require, __exports(mod), __module)
            })
        })).then(resolve, reject)
    }).then(instances => callback && callback(...instances))
}

