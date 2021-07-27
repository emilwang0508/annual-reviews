export default deepCopy = (obj) => {
    if (obj === null) return null
    if (typeof obj === 'object') {
        // 复杂类型
        let result = obj.constructor === Array ? [] : {}

        for (let i in obj) {
            result[i] = typeof i === 'object' ? deepCopy(result[i]) : obj[i]
        }
    } else {
        let result = obj
    }
    return result
}