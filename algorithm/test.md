# 算法练习

### 70.爬楼梯
#### https://leetcode-cn.com/problems/climbing-stairs/submissions/
```js
// 递归
var climbStairs = function(n) {
    const recursion = (n) => {
        if (n === 1) {
            return 1;
        }
        if (n === 2) {
            return 2;
        }
        return recursion(n - 1) + recursion(n - 2)
    }
    return recursion(n)
}
```
```js
// 递归优化
var climbStairs = function(n) {
    const memo = []
    
    const climbStairsMemo = (n, memo) => {
        if (memo[n] > 0) {
            return memo[n]
        }
        if (n === 1) {
            memo[n] = 1
        } else if (n === 2) {
            memo[n] = 2
        } else {
            memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo)
        }
        return memo[n]
    }
    return climbStairsMemo(n, memo)
};
```
```js
// 动态规划
var climbStairs = function(n) {
    const dp = []
    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 2;
    for (let i = 3;i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
};
```
```js
// 滚动数组
var climbStairs = function(n) {
    if (n == 1) {
        return 1;
    }
    let first = 1,
        second = 2
    for (let i = 3;i <= n; i++) {
        let third = first + second
        first = second
        second = third
    }
    return second
};
```