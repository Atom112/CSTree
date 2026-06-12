---
id: nosql-databases
title: NoSQL 数据库概述
summary: NoSQL（Not Only SQL）是在关系数据库之外的数据库类型——文档型、键值型、列族型、图数据库，每种都有自己的适用场景
difficulty: intermediate
order: 17
parent: database-overview
children: []
related: []
prerequisites:
  - database-overview
tags:
  - database
  - nosql
createdAt: 2026-06-12
---

## 为什么需要 NoSQL？

| 场景 | 关系型数据库 | NoSQL |
|------|:----------:|:-----:|
| 海量数据 | 分库分表复杂 | 天然支持水平扩展 |
| 灵活schema | ALTER TABLE 麻烦 | schema-less |
| 高并发 | 连接池有限 | 更轻量 |
| 非结构化数据 | 需要映射 | 直接存储 JSON |

## NoSQL 类型

| 类型 | 代表 | 适用场景 |
|:----:|------|---------|
| **文档型** | MongoDB | JSON 数据存储 |
| **键值型** | Redis | 缓存、会话 |
| **列族型** | Cassandra | 时间序列数据 |
| **图数据库** | Neo4j | 社交网络关系 |

## 小结

| 对比 | 关系型 | NoSQL |
|:----:|:------:|:-----:|
| **一致性** | 强（ACID） | 最终一致性（BASE） |
| **扩展性** | 垂直扩展为主 | 水平扩展优先 |
| **查询** | SQL 强大 | 查询能力有限 |

> 💡 现代系统常用**多模型**——MySQL + Redis + MongoDB 各司其职。

**为什么先学这个？** 至此数据库板块全部完成。接下来可以进入算法与数据结构板块继续学习。
