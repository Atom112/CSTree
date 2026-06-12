---
id: relational-model
title: 关系模型与关系代数
summary: 关系模型（Relational Model）把数据抽象为"关系"（表），用集合论的运算（选择、投影、连接）来操作数据——SQL 就是基于关系代数设计的
difficulty: intermediate
order: 3
parent: er-model
children:
  - sql-basics
related: []
prerequisites:
  - er-model
tags:
  - database
  - relational
  - algebra
createdAt: 2026-06-12
---

## 关系就是"表"

关系模型把数据组织成**关系（Relation）**——就是表：

```
学生关系：
┌─────┬──────┬────┐
│ 学号│ 姓名 │ 年龄│
├─────┼──────┼────┤
│ 001 │ 张三 │ 20 │
│ 002 │ 李四 │ 21 │
│ 003 │ 王五 │ 19 │
└─────┴──────┴────┘
```

## 关系代数——SQL 的数学基础

| 运算 | 含义 | SQL 对应 |
|:----:|------|---------|
| **σ（选择）** | 选行 | `WHERE` |
| **π（投影）** | 选列 | `SELECT 列` |
| **⋈（连接）** | 合并表 | `JOIN` |
| **×（笛卡尔积）** | 所有组合 | `CROSS JOIN` |
| **∪（并）** | 合并行 | `UNION` |
| **−（差）** | 排除 | `EXCEPT` |

## 小结

| 概念 | 要点 |
|------|------|
| **关系** | 属性的集合，没有重复行 |
| **关系代数** | 集合论为基础的查询语言 |
| **选择/投影/连接** | 三种最常用的关系运算 |

**为什么先学这个？** 关系代数是 SQL 的理论基础。接下来学习 [[sql-basics|SQL 基础（DDL, DML）]]。
