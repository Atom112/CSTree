---
id: sql-joins
title: 连接查询与子查询
summary: 连接（JOIN）把多个表的数据按关联条件合并，子查询（Subquery）把一个查询的结果作为另一个查询的输入——它们是 SQL 最强大的功能
difficulty: intermediate
order: 5
parent: sql-basics
children: []
related: []
prerequisites:
  - sql-basics
tags:
  - database
  - sql
  - join
  - subquery
createdAt: 2026-06-12
---

## JOIN——把表连起来

```sql
-- INNER JOIN：两个表都有才返回
SELECT s.name, c.course_name
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id;

-- LEFT JOIN：左表全保留
SELECT s.name, e.course_id
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id;

-- 自连接：表跟自己连
SELECT e1.name AS 员工, e2.name AS 经理
FROM employees e1
JOIN employees e2 ON e1.manager_id = e2.id;
```

## 子查询

```sql
-- WHERE 中的子查询
SELECT name FROM students
WHERE id IN (SELECT student_id FROM enrollments WHERE course_id = 1);

-- FROM 中的子查询
SELECT dept, avg_salary
FROM (SELECT dept, AVG(salary) AS avg_salary FROM employees GROUP BY dept) AS sub;

-- EXISTS
SELECT name FROM students s
WHERE EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id);
```

## 小结

| 类型 | 说明 |
|------|------|
| **INNER JOIN** | 两表匹配的行 |
| **LEFT/RIGHT JOIN** | 保留一表全部行 |
| **子查询** | 嵌套在 SELECT/FROM/WHERE 中的查询 |
| **EXISTS** | 检查是否存在 |

**为什么先学这个？** 掌握查询后，学习[[sql-advanced|视图、索引与事务]]。
