---
id: greedy
title: 贪心算法
summary: 贪心算法（Greedy Algorithm）每步选当前最优——不保证全局最优，但对某些问题（如 Dijkstra、哈夫曼编码）贪心就是最优解
difficulty: advanced
order: 17
parent: recursion-divide-conquer
children: []
related:
  - dynamic-programming
prerequisites:
  - recursion-divide-conquer
tags:
  - algorithm
  - greedy
createdAt: 2026-06-12
---

## 贪心的特点

- 每步做**局部最优**选择
- 不回溯、不改写之前的选择
- 需要证明贪心选择能导出全局最优

```python
# 找零问题——用最少硬币凑金额（美分硬币）
coins = [25, 10, 5, 1]
def make_change(amount):
    result = []
    for coin in coins:
        while amount >= coin:
            result.append(coin)
            amount -= coin
    return result
```

## 对比

| 算法 | 决策方式 | 保证最优？ |
|:----:|:--------:|:----------:|
| **贪心** | 每步局部最优 | 部分问题 |
| **DP** | 考虑所有可能 | ✅ 通常能 |

## 小结

| 概念 | 要点 |
|:----:|------|
| **贪心选择性质** | 局部最优能导出全局最优 |
| **适用** | 活动选择、哈夫曼编码、最小生成树 |

**为什么先学这个？** 另一种算法设计思想——[[backtracking|回溯与剪枝]]。
