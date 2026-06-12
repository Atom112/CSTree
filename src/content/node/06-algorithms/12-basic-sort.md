---
id: basic-sort
title: 基础排序（插入、选择、冒泡）
summary: 插入排序、选择排序、冒泡排序是最简单的三种排序算法——时间复杂度 O(n²)，实现简单，适合小规模数据
difficulty: beginner
order: 12
parent: array-linked-list
children: []
related:
  - advanced-sort
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - sort
createdAt: 2026-06-12
---

## 三种 O(n²) 排序

```python
# 冒泡排序
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n-1-i):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

# 选择排序——每轮选最小的放到前面
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# 插入排序——像打牌一样插入到已排序部分
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
```

## 小结

| 算法 | 最好 | 平均 | 最坏 | 稳定 |
|:----:|:----:|:----:|:----:|:----:|
| 冒泡 | O(n) | O(n²) | O(n²) | ✅ |
| 选择 | O(n²) | O(n²) | O(n²) | ❌ |
| 插入 | O(n) | O(n²) | O(n²) | ✅ |

**为什么先学这个？** 基础排序后，学习更高效的[[advanced-sort|高级排序（归并、快排、堆排）]]。
