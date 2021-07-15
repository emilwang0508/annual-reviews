// 1. 全局对象 requireJs
// 2. 全局对象requreJs的config属性
// 3. config(options) 合并配置项
// 4. 定义define方法，define(name, deps, factory)
//    4.1 定义def依赖集合，将define的方法存入集合中
// 5. 定义require方法，require(deps, factory) 返回Promise
//    5.1 Promise.all 加载所有js，
//    5.2 包括cdn引入，__import方法 
//    5.3 相对路径js __load(__getUrl(path)).then(() => {})
//    5.3.1 获取head节点
//    5.3.2 创建script 节点
//    5.3.3 设置script.type = "text;javascript"
//    5.3.4 设置script.src = url
//    5.3.5 设置script.async = true
//    5.3.6 设置script.onload = resolve
//    5.3.7 设置script.onerror = reject
//    5.3.8 head.appendChild(node)
//    5.3.9 __load(__getUrl(path)).then(() => {})
//    5.3.10 获取cdn文件 存在cdn文件，__import(def.get(defaultOptions.paths[dep]))
//    5.3.11 获取相对路径
//    5.3.11.1 解构def: const {deps, factory} = def.get(dep)
//    5.3.11.2 deps.length === 0,return factory(null)
//    5.3.11.3 require(deps, factory)递归
//    5.4 获取相对路径__getUrl(dep)
//    5.4.1 返回location.pathname 和dep的拼接


// 依赖集合
const def = new Map()
// AMD mini impl
const defaultOptions = {
    paths: ''
}
// From CDN 解析CDN引入的js
const __import = (url) => {
    return new Promise((resolve, reject) => {
        System.import(url).then(resolve, reject)
    })
}

// normal script 解析normal引入的js
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
// 定义一个全局对象
requireJs = {}
// 定义config属性，合并属性配置
requireJs.config = (options) => Object.assign(defaultOptions, options);

// 定义模块，触发的时机其实是在require的时候，所以->收集
define = (name, deps, factory) => {
    // todo: 参数的判断，互换
    // if (Array.isArray(name))

    def.set(name, {name, deps, factory})
}
// 获取
const __getUrl = (dep) => {
    const p = location.pathname
    console.log(p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js')
    return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}

// 其实才是触发加载依赖的地方
require = (deps, factory) => {
    return new Promise((resolve, reject) => {
        Promise.all(deps.map(dep => {
            // 走CDN
            if(defaultOptions.paths[dep]) return __import(defaultOptions.paths[dep])

            return __load(__getUrl(dep)).then(() => {
                const { deps, factory } = def.get(dep)
                if (deps.length === 0) return factory(null)
                return require(deps, factory)
            })

        })).then(resolve, reject)
    })
    .then(instances => factory(...instances))
}