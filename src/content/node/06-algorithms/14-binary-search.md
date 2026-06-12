---
id: binary-search
title: 二分搜索
summary: 二分搜索（Binary Search）每次把搜索范围缩小一半——在有序数组中查找目标值，时间复杂度 O(log n)
difficulty: beginner
order: 14
parent: array-linked-list
children: []
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - search
createdAt: 2026-06-12
---

## 二分查找

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

## 小结

| 条件 | 复杂度 |
|:----:|:------:|
| 有序数组 | O(log n) |
| 注意 | 数组必须有序，否则无法使用 |

**为什么先学这个？** 二分思想在算法设计中广泛应用。学习[[recursion-divide-conquer|递归与分治]]。
