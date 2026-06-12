---
id: query-optimization
title: 查询执行与优化
summary: 查询优化器（Query Optimizer）把 SQL 翻译成执行计划——选择索引、决定 JOIN 顺序、估算代价——让同样的查询跑得更快
difficulty: advanced
order: 12
parent: database-overview
children: []
related:
  - b-plus-tree
prerequisites:
  - sql-basics
  - b-plus-tree
tags:
  - database
  - query
  - optimization
createdAt: 2026-06-12
---

## SQL 查询的执行过程

```
SQL 语句
  │  ↓ 解析
解析树
  │  ↓ 语义检查
逻辑查询计划（关系代数树）
  │  ↓ 优化（重排 JOIN、选择索引）
物理查询计划（具体实现）
  │  ↓ 执行
结果
```

## 常用优化技术

| 技术 | 说明 |
|------|------|
| **索引选择** | 根据 WHERE 条件选择合适的索引 |
| **JOIN 重排** | 小表先 JOIN，减少中间结果 |
| **谓词下推** | 先过滤再 JOIN |
| **投影下推** | 只选择需要的列 |

```sql
-- 优化器可能重写你的查询：
SELECT * FROM orders o JOIN customers c ON o.cid = c.id
WHERE c.age > 18 AND o.amount > 100;
-- → 先过滤客户和订单，再做 JOIN（谓词下推）
```

## 小结

| 概念 | 要点 |
|------|------|
| **查询优化** | 寻找最高效的执行计划 |
| **代价估算** | 基于统计信息选择执行策略 |
| **EXPLAIN** | 查看查询执行计划的命令 |

**为什么先学这个？** 理解优化才能写出高效的 SQL。接下来学习事务的[[acid|ACID 特性]]。
