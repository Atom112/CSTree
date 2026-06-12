---
id: heap
title: 堆（Heap）与优先队列
summary: 堆是完全二叉树——最大堆的父节点 >= 子节点，最小堆相反。插入和删除堆顶 O(log n)，常用于优先队列和堆排序
difficulty: intermediate
order: 6
parent: binary-search-tree
children:
  - advanced-sort
related: []
prerequisites:
  - binary-tree
tags:
  - algorithm
  - heap
  - priority-queue
createdAt: 2026-06-12
---

## 堆的操作

```python
import heapq
heap = []
heapq.heappush(heap, 5)   # 插入 O(log n)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)
heapq.heappop(heap)        # 弹出最小值 3 O(log n)
```

## 应用

| 场景 | 说明 |
|------|------|
| **优先队列** | 任务调度，按优先级执行 |
| **堆排序** | 建堆 O(n)，排序 O(n log n) |
| **Top K** | 维护大小为 K 的最小堆找最大 K 个元素 |

**为什么先学这个？** 堆是[[advanced-sort|高级排序（归并、快排、堆排）]]的基础。
