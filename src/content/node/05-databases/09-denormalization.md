---
id: denormalization
title: 规范化与反规范化
summary: 规范化减少冗余但可能降低查询性能，反规范化故意增加冗余来提升查询速度——两者需要在设计时权衡
difficulty: advanced
order: 9
parent: normalization
children: []
related: []
prerequisites:
  - normalization
tags:
  - database
  - design
  - performance
createdAt: 2026-06-12
---

## 规范化的代价

```sql
-- 完全规范化：查询需要 JOIN 多张表
SELECT o.id, c.name, p.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;
-- 每次查询都要 JOIN——当数据量大时变慢

-- 反规范化：把冗余字段直接放进订单表
SELECT id, customer_name, product_name FROM orders;
-- 快！但更新客户名称时要改所有关联订单
```

**取舍原则**：读多写少 → 反规范化；写多读少 → 规范化。

## 小结

| 概念 | 要点 |
|------|------|
| **规范化** | 减少冗余，避免更新异常 |
| **反规范化** | 增加冗余，提升查询性能 |
| **场景** | 数据仓库/OLAP 更倾向反规范化 |

**为什么先学这个？** 理解权衡后，学习索引的底层实现——[[b-plus-tree|B+ 树索引]]。
