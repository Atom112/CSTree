---
id: hash-index
title: 哈希索引
summary: 哈希索引（Hash Index）用哈希函数把键映射到桶——等值查询 O(1)，但不支持范围查询。适合 Key-Value 场景
difficulty: advanced
order: 11
parent: database-overview
children: []
related:
  - b-plus-tree
prerequisites:
  - database-overview
tags:
  - database
  - index
  - hash
createdAt: 2026-06-12
---

## 哈希表是怎么做索引的？

```
键 → hash(键) → 桶号 → 桶内存储 (键, 值)

name='张三' → hash → 桶 3 → 找到数据
name='李四' → hash → 桶 7 → 找到数据
```

| 对比 | B+ 树 | 哈希 |
|:----:|:-----:|:----:|
| **等值查询** | O(log n) | O(1) |
| **范围查询** | ✅ 高效 | ❌ 不支持 |
| **排序** | ✅ 天然有序 | ❌ |
| **适用** | 通用场景 | 精确匹配 |

> 💡 MySQL InnoDB 的"自适应哈希索引"——自动把频繁访问的 B+ 树页转换为哈希索引。

## 小结

| 概念 | 要点 |
|------|------|
| **哈希索引** | 等值查询最快，不支持范围查询 |
| **哈希冲突** | 链地址法或开放地址法解决 |
| **适用** | Key-Value 数据库、缓存、精确查找 |

**为什么先学这个？** 理解索引后，学习[[query-optimization|查询执行与优化]]。
