---
id: array-linked-list
title: 数组与链表
summary: 数组（Array）和链表（Linked List）是最基础的数据结构——数组在内存中连续存储，支持随机访问；链表通过指针串联，支持灵活插入删除
difficulty: beginner
order: 1
parent:
children:
  - stack-queue
related: []
prerequisites: []
tags:
  - algorithm
  - data-structure
createdAt: 2026-06-12
---

## 数组 vs 链表

| 操作 | 数组 | 链表 |
|:----:|:----:|:----:|
| **随机访问** | O(1) | O(n) |
| **插入/删除（开头）** | O(n) | O(1) |
| **插入/删除（末尾）** | O(1) | O(1)（有尾指针）或 O(n) |
| **内存** | 连续，可能浪费 | 分散，额外指针开销 |

```python
# 数组——内存连续
arr = [1, 2, 3, 4, 5]
arr[2]  # 直接访问，O(1)

# 链表——指针串联
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None

head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)
```

> 💡 数组"随机访问"快的本质：`arr[i] = base_address + i * element_size`——一次乘法+加法就找到地址。

## 小结

| 概念 | 要点 |
|------|------|
| **数组** | 连续内存，随机访问 O(1) |
| **链表** | 节点+指针，插入删除 O(1) |

**为什么先学这个？** 数组和链表是所有数据结构的构建块。接下来看看[[stack-queue|栈与队列]]。
