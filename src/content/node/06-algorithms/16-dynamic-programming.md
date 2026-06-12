---
id: dynamic-programming
title: 动态规划
summary: 动态规划（Dynamic Programming, DP）把问题分解为重叠子问题，通过"记忆化"避免重复计算——最优子结构 + 状态转移方程是 DP 的核心
difficulty: advanced
order: 16
parent: recursion-divide-conquer
children: []
related:
  - greedy
prerequisites:
  - recursion-divide-conquer
tags:
  - algorithm
  - dp
createdAt: 2026-06-12
---

## 斐波那契——DP 入门

```python
# 朴素递归——大量重复计算
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)  # O(2^n)

# DP——自底向上
def fib_dp(n):
    dp = [0, 1]
    for i in range(2, n+1):
        dp.append(dp[i-1] + dp[i-2])
    return dp[n]  # O(n)
```

## 经典 DP 问题

| 问题 | 状态定义 | 转移方程 |
|:----:|---------|---------|
| **斐波那契** | dp[i] = 第 i 个数 | dp[i] = dp[i-1] + dp[i-2] |
| **爬楼梯** | dp[i] = 到 i 阶的方法数 | dp[i] = dp[i-1] + dp[i-2] |
| **背包** | dp[i][w] = 前 i 个物品容量 w 最大价值 | 选或不选 |
| **最长公共子序列** | dp[i][j] = text1[:i] 和 text2[:j] 的 LCS | 相等则+1，不等则取 max |

## 小结

| 概念 | 要点 |
|:----:|------|
| **最优子结构** | 大问题的最优解包含子问题的最优解 |
| **状态转移方程** | 描述子问题之间的关系 |
| **重叠子问题** | 子问题重复出现，只需计算一次 |

**为什么先学这个？** DP 与[[greedy|贪心算法]]密切相关——贪心是 DP 的特例，每步做局部最优选择。
