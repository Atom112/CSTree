---
id: sql-advanced
title: 视图、索引与事务
summary: 视图是"虚拟表"，索引加速查询，事务保证多步操作的原子性——它们是 SQL 进阶的三大武器
difficulty: intermediate
order: 6
parent: sql-basics
children:
  - acid
related:
  - b-plus-tree
prerequisites:
  - sql-basics
tags:
  - database
  - sql
  - view
  - index
  - transaction
createdAt: 2026-06-12
---

## 视图（View）

```sql
-- 创建视图——像表一样查询，但不存数据
CREATE VIEW student_courses AS
SELECT s.name, c.course_name
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id;

-- 用视图
SELECT * FROM student_courses WHERE name = '张三';
```

## 索引（Index）

```sql
-- 创建索引——加速查询
CREATE INDEX idx_student_name ON students(name);

-- 复合索引
CREATE INDEX idx_name_age ON students(name, age);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON students(email);
```

> 💡 索引加快 SELECT，但减慢 INSERT/UPDATE——每次修改数据都要更新索引。

## 事务（Transaction）

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- 要么都成功，要么都失败

-- 出错了可以回滚
ROLLBACK;
```

## 小结

| 概念 | 要点 |
|------|------|
| **视图** | 虚拟表，简化复杂查询 |
| **索引** | 加速查询（B+ 树或哈希） |
| **事务** | ACID——原子性、一致性、隔离性、持久性 |

**为什么先学这个？** 事务的 ACID 特性需要在 [[acid|ACID 特性]] 中深入理解。
