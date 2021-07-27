// https://leetcode-cn.com/problems/can-place-flowers/
export default (flowerbed, n) => {
    // 记录可以中几朵
    let count = 0;
    for (let i = 0; i < flowerbed.length; i++) {
        let pre = flowerbed[i -1],
            next = flowerbed[i + 1] 
            cur = flowerbed[i]
        if (pre === undefined) pre = 0
        if (next === undefined) next = 0
        if (pre === 0 && cur === 0 && next=== 0) {
            flowerbed.splice(i, 1, 1)
            // flowerbed[i] = 1
            count++
        }
    }
    return count >= n
}