---
id: recursion-divide-conquer
title: 递归与分治
summary: 分治（Divide and Conquer）把大问题分解成小问题分别解决再合并——递归是实现分治的自然方式。归并排序、快速排序都是分治思想的应用
difficulty: intermediate
order: 15
parent: stack-queue
children:
  - dynamic-programming
  - big-o-notation
related:
  - advanced-sort
prerequisites:
  - stack-queue
tags:
  - algorithm
  - recursion
  - divide-conquer
createdAt: 2026-06-12
---

## 分治三步法

1. **分解（Divide）**：把问题分成更小的子问题
2. **解决（Conquer）**：递归解决子问题
3. **合并（Combine）**：把子问题的解合并为原问题的解

```python
# 分治求最大值
def find_max(arr):
    if len(arr) == 1:
        return arr[0]
    mid = len(arr) // 2
    left_max = find_max(arr[:mid])
    right_max = find_max(arr[mid:])
    return max(left_max, right_max)
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **分治** | 分解→解决→合并 |
| **递归** | 函数调用自身 |
| **基线条件** | 递归终止的条件 |

**为什么先学这个？** 分治是算法设计的核心思想之一。接下来学习[[dynamic-programming|动态规划]]。
