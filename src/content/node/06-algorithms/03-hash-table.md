---
id: hash-table
title: 哈希表（Hash Table）
summary: 哈希表通过哈希函数把键映射到数组下标——查找、插入、删除平均 O(1)，是最实用的数据结构之一
difficulty: intermediate
order: 3
parent: stack-queue
children:
  - binary-tree
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - hash-table
createdAt: 2026-06-12
---

## 哈希表的工作原理

```
键 "张三" → hash函数 → 索引 5 → 数组[5] = ("张三", 值)
键 "李四" → hash函数 → 索引 2 → 数组[2] = ("李四", 值)
```

## 哈希冲突

不同键映射到同一下标——用**链地址法**解决：

```
数组[5] → ("张三", 值) → ("王五", 值) → ...（链表）
```

## 小结

| 操作 | 平均复杂度 | 最坏 |
|:----:|:---------:|:----:|
| 查找 | O(1) | O(n) |
| 插入 | O(1) | O(n) |
| 删除 | O(1) | O(n) |

**为什么先学这个？** 哈希是高效查找的基础。接下来进入[[binary-tree|二叉树与遍历]]。
