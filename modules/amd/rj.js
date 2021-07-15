// 依赖收集
const def = new Map()
// 定义一个全局对象
requireJs = {}

const defaultOpts = {
    paths: ''
}

// 定义requireJs的属性, 合并默认属性
requireJs.config = (options) => Object.assign(defaultOpts, options)

// 定义模块，真正的触发时机是在require的时候，所以->收集
define = (name, deps, factory) => {
    def.set(name, {name, deps, factory})
};

// __import
const __import = (url) => {
    return new Promise((resolve, reject) => {
        System.import(url).then(resolve, reject)
    })
}

// head标签内插入需要引入的js
const __load = (url) => {
    return new Promise((resolve, reject) => {
        // 找到head标签
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

// 获取相对路径
const __getUrl = (dep) => {
    const p = location.pathname
    return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}

// 触发加载依赖
require = (deps, factory) => {
    return new Promise((resolve, reject) => {
        Promise.all(deps.map(dep => {
            // 引入CDNjs文件
            if(defaultOpts.paths[dep]) return __import(defaultOpts.paths[dep])
            
            // 引入相对路径文件
            return __load(__getUrl(dep)).then(() => {
                const { deps, factory } = def.get(dep)
                
                if (deps.length === 0) return factory(null)
                return require(deps, factory)
            })

        })).then(resolve, reject)
    }).then(instances => factory(...instances))
}