function subStr(str) {
    let count = 0, // 连续子串的数量
        curLen = 1, // 当前遍历的子串长度
        preLen = 0, // 上次遍历的子串长度
        strArr = str.split(''),
        res = []
    // 从第二项开始遍历
    for (let i = 1, len = strArr.length; i < len; i++) {
        if (strArr[i] === strArr[i - 1]) { // 如果当前子串等于上个子串，curLen++
            curLen++
        } else { // 不等于子串，重置
            preLen = curLen 
            curLen = 1
        }
        if (preLen >= curLen) {
            count++
        }

    }
    console.log(res)
    return res;
}
export default subStr