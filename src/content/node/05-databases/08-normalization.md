---
id: normalization
title: 范式（1NF ~ BCNF）
summary: 范式（Normal Form）是评价关系表设计"好坏"的标准——范式越高，数据冗余越少，更新异常越少
difficulty: advanced
order: 8
parent: functional-dependency
children:
  - denormalization
related: []
prerequisites:
  - functional-dependency
tags:
  - database
  - normalization
  - design
createdAt: 2026-06-12
---

## 为什么要规范化？

```sql
-- 坏的设计：一个表里所有东西
CREATE TABLE bad_design (
    student_id, name, dept, dean, course, grade
);
-- 问题：院长名字重复存储、更新院长要改多行、
-- 如果学生没选课就查不到学生信息...

-- 好设计：拆分成多个表
-- students, departments, courses, enrollments
```

| 级别 | 要求 |
|:----:|------|
| **1NF** | 每列都是原子的（不可再分） |
| **2NF** | 满足 1NF，且非主键列完全依赖于主键 |
| **3NF** | 满足 2NF，且非主键列不传递依赖于主键 |
| **BCNF** | 每个决定因素都是候选键 |

## 实例

学号 → 姓名、系名
系名 → 院长

```
不满足 3NF 的表：
学生（学号, 姓名, 系名, 院长）
       ↑ 传递依赖：学号→系名→院长

拆分：
学生（学号, 姓名, 系名）
院系（系名, 院长）
```

> 💡 **反范式化**：有时为了提高查询性能，故意保留一些冗余——用空间换时间。

## 小结

| 范式 | 解决的问题 |
|:----:|-----------|
| **1NF** | 非原子列 |
| **2NF** | 部分依赖 |
| **3NF** | 传递依赖 |
| **BCNF** | 所有决定因素都是候选键 |

**为什么先学这个？** 规范化是数据库设计的基础。下一步看看[[denormalization|规范化与反规范化]]的权衡。
