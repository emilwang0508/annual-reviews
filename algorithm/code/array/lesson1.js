// https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/submissions/
export default (str) => {
    if (str < 2) {
        return []
    }
    // 建立电话号码键盘映射
    let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
    // 把输入字符串按单字符串分割，变成数组
    let num = str.split('')
    // 保存键盘映射后的字母内容，如23 => ['abc', 'def']
    let code = []
    if (num.length < 2) {
        if(!str){
            return []
        }
        return map[str].split('')
    }
    num.forEach( item => {
        if(map[item]) {
            code.push(map[item])
        }
    })
    // 组合运算
    let comb = (arr) => {
        // 临时变量来保存前两个组合的结果
        let tmp = []
        // 最外层的循环是遍历第一个元素，里层的循环是遍历第二个元素
        for (let i = 0, il = arr[0].length; i< il; i++) {
           for (let j = 0, jl = arr[1].length; j< jl; j++) {
               tmp.push(`${arr[0][i]}${arr[1][j]}`)
           }
        }
        arr.splice(0, 2, tmp)
        if (arr.length > 1) {
            comb(arr)
        } else {
            return tmp
        }
        return arr[0]
    }
    
    return comb(code)
}