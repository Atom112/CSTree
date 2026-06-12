---
id: sql-basics
title: SQL 基础（DDL, DML）
summary: SQL（Structured Query Language）是操作关系数据库的标准语言——DDL 定义表结构，DML 操作数据
difficulty: intermediate
order: 4
parent: relational-model
children:
  - sql-joins
  - sql-advanced
related: []
prerequisites:
  - relational-model
tags:
  - database
  - sql
  - ddl
  - dml
createdAt: 2026-06-12
---

## DDL——定义表结构

```sql
-- 创建表
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT CHECK (age > 0),
    email VARCHAR(100) UNIQUE
);

-- 修改表
ALTER TABLE students ADD COLUMN phone VARCHAR(20);

-- 删除表
DROP TABLE students;
```

## DML——操作数据

```sql
-- 插入
INSERT INTO students VALUES (1, '张三', 20, 'zhangsan@example.com');

-- 查询
SELECT * FROM students WHERE age > 18;

-- 更新
UPDATE students SET age = 21 WHERE id = 1;

-- 删除
DELETE FROM students WHERE id = 1;
```

## 数据类型

| 类型 | 例子 |
|------|------|
| 整数 | INT, BIGINT, SMALLINT |
| 浮点 | FLOAT, DOUBLE, DECIMAL |
| 字符串 | VARCHAR(255), TEXT, CHAR(10) |
| 日期 | DATE, DATETIME, TIMESTAMP |
| 布尔 | BOOLEAN |

## 小结

| 概念 | 要点 |
|------|------|
| **DDL** | CREATE, ALTER, DROP |
| **DML** | INSERT, SELECT, UPDATE, DELETE |
| **约束** | PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL |

**为什么先学这个？** 掌握基础后，学习[[sql-joins|连接查询与子查询]]。
