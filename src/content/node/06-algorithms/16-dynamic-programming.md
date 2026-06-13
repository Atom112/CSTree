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
updatedAt: 2026-06-13
---

## 🪜 爬楼梯——一个简单的例子

假设你要爬 10 级台阶。每次可以走 1 级或 2 级。问：爬到第 10 级，一共有多少种不同的走法？

暴力递归的思路：
- 到第 10 级 = 从第 9 级走 1 级 + 从第 8 级走 2 级
- 到第 9 级 = 从第 8 级走 1 级 + 从第 7 级走 2 级
- ……

```python
def climb_stairs(n):
    if n <= 1:
        return 1
    return climb_stairs(n-1) + climb_stairs(n-2)

# 但这样计算 climb_stairs(10) 时，climb_stairs(5) 被计算了无数次！
```

画一下调用树就会发现——**大量的子问题被重复计算**。`climb_stairs(5)` 在计算 `climb_stairs(10)` 的过程中被算了无数次。

**动态规划（Dynamic Programming, DP）就是来解决这个问题的**：把子问题的答案"记住"（缓存），下次再用时直接取。

> 📝 **类比：期末考试复习"
>
> 你要复习 5 章内容。
>
> **暴力递归式复习**：每次遇到一个知识点都从头推导一遍——"哦，这个要用到第一章的知识，我先把第一章看一遍"——结果每次都要重看第一章。
>
> **动态规划式复习**：先把第一章学完，记在笔记本上。学第二章时，如果用到第一章的知识，直接翻笔记本。学第三章时也是如此。
>
> 关键区别：你用一个"笔记本"记住了已经算过的结果。这就是 DP 的核心——**记忆化**。

---

## 🔑 DP 的两个关键特征

一个问题能用 DP 解决，必须满足两个条件：

### ① 最优子结构（Optimal Substructure）

**大问题的最优解包含子问题的最优解。**

- 爬楼梯：到第 10 级的方法数 = 到第 9 级的方法数 + 到第 8 级的方法数
- 最短路径：A→D 的最短路径 = min(A→B 最短 + B→D, A→C 最短 + C→D)
- 背包问题：容量 W 的最大价值 = max(装物品 i 的方案, 不装物品 i 的方案)

### ② 重叠子问题（Overlapping Subproblems）

**不同的子问题会重复出现。**

- 爬楼梯：`climb(7)` 在计算 `climb(9)` 和 `climb(8)` 时都会用到
- 斐波那契：`fib(5)` 在计算 `fib(6)` 和 `fib(7)` 时都会用到
- 如果子问题完全不重叠，分治就够了，不需要 DP

---

## 🛠️ DP 的两种实现方式

### 方式 1：自顶向下 + 记忆化（Memoization）

保持递归的结构，但把算过的结果存起来：

```python
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    
    if n in memo:          # 已经算过了 → 直接取
        return memo[n]
    if n <= 1:             # 基线条件
        return n
    
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
```

### 方式 2：自底向上 + 填表（Tabulation）

从最小的子问题开始，逐步往上推理：

```python
def fib_dp(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]  # 状态转移方程
    
    return dp[n]

# 空间优化版——不需要数组，只用两个变量
def fib_dp_optimized(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

### 对比

| 维度 | 自顶向下（记忆化）| 自底向上（填表）|
|:----:|:---------------:|:--------------:|
| **思路** | 递归 + 缓存 | 迭代 + 表格 |
| **代码** | 和原递归思路一致，改造成本低 | 需要先设计 DP 表格 |
| **性能** | 有递归开销 | 通常更快（无函数调用）|
| **空间** | 可能少算不需要的子问题 | 通常要填满整个表格 |
| **直觉** | "我需要什么就算什么" | "从小问题逐步构建到大问题"|

---

## 📝 DP 解题四步法

### 案例：0/1 背包问题

> 有一个背包，容量为 W。有 n 个物品，每个物品有重量 weight[i] 和价值 value[i]。在不超过背包容量的前提下，如何装能让总价值最大？

### 第 1 步：定义状态

**状态**：dp[i][w] = **考虑前 i 个物品、背包容量为 w 时，能获得的最大价值。**

### 第 2 步：找出状态转移方程

```python
# 对于第 i 个物品，有两种选择：
# 1. 不装：dp[i][w] = dp[i-1][w]（和前面 i-1 个物品的结果一样）
# 2. 装：dp[i][w] = dp[i-1][w-weight[i]] + value[i]（腾出空间装上）
# 取两者中的较大值

dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
```

### 第 3 步：确定初始条件

```python
dp[0][w] = 0  # 0 个物品，价值为 0
dp[i][0] = 0  # 容量为 0，价值为 0
```

### 第 4 步：确定遍历顺序

```python
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i-1] <= w:
                # 可以装：选不装和装中价值更大的
                dp[i][w] = max(dp[i-1][w], 
                              dp[i-1][w-weights[i-1]] + values[i-1])
            else:
                # 装不下，只能不装
                dp[i][w] = dp[i-1][w]
    
    return dp[n][W]
```

### 空间优化（滚动数组）

```python
def knapsack_optimized(weights, values, W):
    n = len(weights)
    dp = [0] * (W + 1)  # 一维就够了
    
    for i in range(n):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[W]
```

> 💡 **为什么内层循环要倒序？** 因为正序会重复使用同一个物品（变成完全背包），倒序保证每个物品只使用一次（0/1 背包）。

---

## 🧩 经典 DP 问题汇总

| 问题 | 状态定义 | 转移方程 | 复杂度 |
|:----:|---------|---------|:------:|
| **斐波那契** | dp[i] = 第 i 个数 | dp[i] = dp[i-1] + dp[i-2] | O(n) |
| **爬楼梯** | dp[i] = 到第 i 阶的方法 | dp[i] = dp[i-1] + dp[i-2] | O(n) |
| **0/1 背包** | dp[i][w] = 前 i 个物品容量 w 的最大价值 | max(不装, 装) | O(nW) |
| **最长公共子序列** | dp[i][j] = text1[:i] 和 text2[:j] 的 LCS | 相等=dp[i-1][j-1]+1, 不等=max(左,上) | O(mn) |
| **最长递增子序列** | dp[i] = 以 nums[i] 结尾的 LIS 长度 | dp[i] = max(dp[j]+1) for j < i | O(n²) |
| **编辑距离** | dp[i][j] = word1[:i] → word2[:j] 的最小操作 | min(增, 删, 改) | O(mn) |

### 最长公共子序列（LCS）详解

```python
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1  # 字符相等，LCS 长度 +1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])  # 取较大的
    
    return dp[m][n]

print(lcs("abcde", "ace"))  # 3 → "ace"
```

---

## 🤔 什么时候用 DP？

```
你的问题 → 是否具有"最优子结构"？
  ├─ 否 → 分治、贪心、或者暴力搜索
  └─ 是 → 子问题是否"重叠"？
       ├─ 否 → 分治就够了
       └─ 是 → 用 DP！
```

**常见的 DP 信号**：
- "求最大值/最小值"
- "求有多少种方案"
- "判断是否可行"
- 问题可以被"划分"成更小的同类问题

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **动态规划（DP）** | 把问题分解成重叠子问题，记住答案避免重复计算 |
| **最优子结构** | 大问题的最优解由子问题最优解构成 |
| **重叠子问题** | 同一个子问题被多次遇到 |
| **状态（State）** | DP 表中每个格子的定义——"什么情况下什么值" |
| **状态转移方程** | 状态之间的递推关系——"怎么从一个状态算到下一个" |
| **记忆化（Memoization）** | 自顶向下——递归 + 缓存 |
| **填表（Tabulation）** | 自底向上——从小问题逐步构建 |

> 🎯 **小练习**：有一个 3×3 的网格，从左上角走到右下角，每次只能向右或向下走。有多少条不同的路径？提示：定义 dp[i][j] = 到达 (i,j) 的路径数。写出转移方程并计算。

**为什么先学这个？** DP 是最重要的算法设计思想之一。和它密切相关的是[[greedy|贪心算法]]——贪心是 DP 的"简化版"，每步只做局部最优选择。
