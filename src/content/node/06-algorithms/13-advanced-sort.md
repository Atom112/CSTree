---
id: advanced-sort
title: 高级排序（归并、快排、堆排）
summary: 归并排序稳定 O(n log n) 但需额外空间，快速排序平均 O(n log n) 且原地排序，堆排序 O(n log n) 无额外空间——各有优劣
difficulty: intermediate
order: 13
parent: heap
children: []
related:
  - basic-sort
prerequisites:
  - heap
tags:
  - algorithm
  - sort
createdAt: 2026-06-12
---

## 三种 O(n log n) 排序

```python
# 归并排序——分治，合并两个有序数组
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(l, r):
    result = []
    i = j = 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]:
            result.append(l[i]); i += 1
        else:
            result.append(r[j]); j += 1
    return result + l[i:] + r[j:]

# 快速排序——选 pivot，分区，递归
def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr)-1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p-1)
        quick_sort(arr, p+1, high)
```

## 小结

| 算法 | 时间 | 空间 | 稳定 |
|:----:|:----:|:----:|:----:|
| 归并 | O(n log n) | O(n) | ✅ |
| 快排 | O(n log n) 平均 | O(log n) | ❌ |
| 堆排 | O(n log n) | O(1) | ❌ |

**为什么先学这个？** 排序后学习[[binary-search|二分搜索]]。
