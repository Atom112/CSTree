---
id: er-model
title: 实体关系模型（ER）
summary: 实体关系模型（Entity-Relationship Model）是用图形化的方式描述现实世界的数据结构——实体是"东西"，关系是"联系"，是数据库设计的第一步
difficulty: intermediate
order: 2
parent: database-overview
children:
  - relational-model
related: []
prerequisites:
  - database-overview
tags:
  - database
  - er-model
  - design
createdAt: 2026-06-12
---

## 画图之前先想清楚

在写 SQL 之前——先用 ER 图画清楚"有哪几种数据，它们之间有什么关系"。

> 🏫 **类比：盖楼先画图纸**
> 你不会直接开始砌砖——先画蓝图。ER 图就是数据库的蓝图。

```
学生 ──── 选课 ──── 课程
  │                 │
姓名、学号          课程名、学分
```

## ER 图的基本元素

| 符号 | 含义 | 例子 |
|:----:|------|------|
| **矩形** | 实体（Entity） | 学生、课程、教师 |
| **椭圆** | 属性（Attribute） | 姓名、年龄、学号 |
| **菱形** | 关系（Relationship） | 选课、授课 |
| **直线** | 连接 | 实体↔关系 |
| **下划线** | 主键 | 学号、课程号 |

## 关系类型

```
1:1（一对一）        1:N（一对多）          M:N（多对多）
人——身份证          班级——学生            学生——课程
```

## 小结

| 概念 | 要点 |
|------|------|
| **ER 模型** | 实体 + 属性 + 关系的数据建模方法 |
| **实体** | 现实世界中的"事物" |
| **关系** | 实体之间的联系（1:1, 1:N, M:N） |
| **属性** | 实体的特征 |

**为什么先学这个？** ER 模型是数据库设计的第一步。下一步把 ER 图转化为[[relational-model|关系模型与关系代数]]。
