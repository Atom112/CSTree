---
id: database-overview
title: 数据库系统概述
summary: 数据库（Database）是持久化存储和管理数据的系统——相比文件系统，它提供了高效查询、并发控制、故障恢复、数据一致性等能力
difficulty: beginner
order: 1
parent:
children:
  - er-model
related:
  - file-system-interface
prerequisites:
  - file-system-interface
tags:
  - database
  - overview
createdAt: 2026-06-12
---

## 为什么不用文件存数据？

```python
# 用文件存数据
users = {}
with open('users.txt', 'r') as f:
    for line in f:
        id, name, age = line.split(',')
        users[id] = {'name': name, 'age': int(age)}

# 查年龄大于 18 的用户——你要遍历所有行
result = [u for u in users.values() if u['age'] > 18]
# 如果 100 万用户——慢！而且多个程序同时写这个文件会冲突
```

**数据库**解决了这些问题：索引、并发控制、容错、安全。

> 🏫 **类比：文件柜 vs 档案管理系统**
> - **文件系统** = 一堆文件柜——你要自己翻、自己整理、自己保证别丢
> - **数据库** = 档案管理系统——你说"查张三的档案"，系统自动找到

## 核心概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **表（Table）** | 数据按行和列组织 | Excel 表格 |
| **行（Row）** | 一条完整记录 | Excel 的一行 |
| **列（Column）** | 一个字段 | Excel 的一列 |
| **主键（PK）** | 唯一标识一行 | 身份证号 |
| **外键（FK）** | 引用其他表的行 | 学号关联学生表 |
| **索引（Index）** | 加速查询的数据结构 | 书的目录 |

## 数据库类型

| 类型 | 数据模型 | 代表 |
|------|---------|------|
| **关系型** | 表（行+列） | MySQL, PostgreSQL, SQLite |
| **文档型** | JSON 文档 | MongoDB, CouchDB |
| **键值型** | Key-Value | Redis, DynamoDB |
| **列族型** | 列族 | Cassandra, HBase |
| **图数据库** | 节点+边 | Neo4j |

## 小结

| 概念 | 要点 |
|------|------|
| **数据库** | 数据持久化+高效查询+并发控制 |
| **表/行/列** | 关系型数据库的基本组织方式 |
| **主键** | 唯一标识一行 |
| **索引** | 加速查询（下一节详述） |

**为什么先学这个？** 了解数据库基本概念后，开始学习数据建模——[[er-model|实体关系模型（ER）]]。
