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
updatedAt: 2026-06-13
---

## 🤔 "查张三的成绩"——数据不在同一张表里

上一节我们设计的选课系统有三张表：**学生表（students）、课程表（courses）、选课记录表（enrollments）**。

现在要查"张三的所有课程成绩"——问题来了：**姓名在 students 表，课程名在 courses 表，成绩在 enrollments 表。怎么在一次查询中拿到所有信息？**

答案就是 **JOIN（连接）**——把多张表按关联条件合并成一张大表再查。

> 🧩 **类比：拼图**
>
> 学生表、课程表、选课记录表各自记录了信息的一个侧面，就像三块拼图碎片。JOIN 就是"把它们拼在一起"的机制。
>
> 拼合的依据（关联条件）就是：**选课记录中的 student_id 对应学生表中的 student_id，course_id 对应课程表中的 course_id。**

用关系代数的语言说：这就是 **⋈（连接操作）** 的 SQL 版本。

---

## 🔗 四种常见的 JOIN

### 1️⃣ INNER JOIN —— 只保留匹配的行

这是最常用的 JOIN。它把两表中**关联条件成立的行**合并，**不匹配的行丢弃**。

```sql
SELECT s.name, e.course_id, e.grade
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id;
```

结果只有**选了课的学生**——如果一个学生还没选课，他的信息就不会出现。

```
学生表                     选课记录表                    结果
┌────┬─────┐            ┌─────┬──────┐            ┌─────┬────────┬─────┐
│ id │姓名 │            │sid  │grade │            │姓名  │course  │grade│
├────┼─────┤            ├─────┼──────┤            ├─────┼────────┼─────┤
│ 1  │张三 │─INNER JOIN─│ 1   │ 85   │───────────│ 张三 │ CS101  │ 85  │
│ 2  │李四 │            │ 1   │ 92   │            │ 张三 │ CS102  │ 92  │
│ 3  │王五 │            │ 2   │ 78   │            │ 李四 │ CS101  │ 78  │
└────┴─────┘            └─────┴──────┘            └─────┴────────┴─────┘
                                                  王五没有选课 → 不在结果中
```

> 💡 **INNER JOIN 可以简写为 JOIN**——在大多数数据库中是同一个意思。

### 2️⃣ LEFT JOIN —— 左表全保留

左表的行**全部保留**，右表没有匹配的用 `NULL` 填充。

```sql
SELECT s.name, e.course_id
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id;
```

结果会包含**所有学生**——选了课的显示课程号，没选课的在课程号列显示 NULL。

```
┌─────┬──────────┐
│姓名  │ course_id │
├─────┼──────────┤
│张三  │ CS101    │
│张三  │ CS102    │
│李四  │ CS101    │
│王五  │ NULL     │  ← 没选课，但学生信息不会丢
└─────┴──────────┘
```

**什么时候用？** 你想保留"主表"的所有信息时。比如查"所有学生的选课情况，没选课的也要列出来"。

### 3️⃣ RIGHT JOIN —— 右表全保留

和 LEFT JOIN 相反——右表的行全部保留。

```sql
-- 右表课程全部保留，没学生选的课课程名也显示
SELECT s.name, c.course_name
FROM enrollments e
RIGHT JOIN courses c ON e.course_id = c.course_id;
```

> 💡 **实用建议**：很多开发者**只用 LEFT JOIN**，因为它更符合阅读习惯（从左往右读）。RIGHT JOIN 只是把左右表换了个方向，没有本质区别。

### 4️⃣ FULL OUTER JOIN —— 两表都保留

两表的行**全部保留**，没有匹配的用 NULL 填充。相当于 LEFT JOIN + RIGHT JOIN。

```sql
SELECT s.name, c.course_name
FROM students s
FULL OUTER JOIN enrollments e ON s.student_id = e.student_id
FULL OUTER JOIN courses c ON e.course_id = c.course_id;
```

> ⚠️ MySQL 不直接支持 FULL OUTER JOIN，但可以用 UNION 模拟。

---

## 🔄 多表 JOIN

现实中你很少只 JOIN 两张表——往往是三张、四张甚至更多。

查"张三的所有课程名称和成绩"——需要 JOIN 三张表：

```sql
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.name = '张三';
```

执行过程：
1. 学生表 JOIN 选课记录表 → 得到"学生-选课"临时结果
2. 临时结果再 JOIN 课程表 → 加上课程名
3. WHERE 过滤 → 只保留张三的数据

```
学生 ──JOIN── 选课记录 ──JOIN── 课程
                               ↓
                    姓名 │ 课程名 │ 成绩
```

---

## 🪆 自连接（Self-Join）——表跟自己连

一个比较特殊的场景——**表里的行之间存在关联关系**。

```sql
-- 员工表中，每个员工有 manager_id（经理的 id）
SELECT e1.name AS 员工, e2.name AS 经理
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

```
employees 表：
┌────┬──────┬──────────┐
│ id │ name │manager_id│
├────┼──────┼──────────┤
│ 1  │ 张三  │ NULL     │  ← 张三没有经理（他是老板）
│ 2  │ 李四  │ 1        │  ← 李四的经理是张三
│ 3  │ 王五  │ 1        │
│ 4  │ 赵六  │ 2        │  ← 赵六的经理是李四
└────┴──────┴──────────┘

查询结果：
┌─────┬─────┐
│员工 │经理  │
├─────┼─────┤
│李四  │张三  │
│王五  │张三  │
│赵六  │李四  │
└─────┴─────┘
```

关键技巧：**把同一张表当成两张不同的表来用**，通过别名（e1、e2）区分。

---

## 🪆 子查询（Subquery）——查询里套查询

子查询就是**把一个查询的结果作为另一个查询的输入**。听起来复杂，但实际很直观：

### WHERE 中的子查询

```sql
-- 查"选了 CS101 这门课的所有学生姓名"
SELECT name FROM students
WHERE student_id IN (
    SELECT student_id FROM enrollments WHERE course_id = 'CS101'
);
```

执行顺序：
1. **先执行子查询**：`SELECT student_id FROM enrollments WHERE course_id = 'CS101'` → 返回 (1, 2)
2. **再执行外层查询**：`SELECT name FROM students WHERE student_id IN (1, 2)` → 张三、李四

### FROM 中的子查询

```sql
-- 查每个班的平均年龄，只显示平均年龄大于20的班
SELECT class_name, avg_age
FROM (
    SELECT class_name, AVG(age) AS avg_age
    FROM students
    GROUP BY class_name
) AS class_stats
WHERE avg_age > 20;
```

这里子查询的结果被当成"临时表"使用——注意要给临时表取个名字（`AS class_stats`）。

### EXISTS 子查询

```sql
-- 查"至少选了一门课的学生"
SELECT name FROM students s
WHERE EXISTS (
    SELECT 1 FROM enrollments e WHERE e.student_id = s.student_id
);
```

`EXISTS` 只检查子查询是否有返回行——有就返回 TRUE，没有就 FALSE。和 `IN` 的区别是：`EXISTS` 对大数据量通常更快，因为它只要找到一条匹配就停止。

---

## ⚖️ JOIN vs 子查询：什么时候用哪个？

| 场景 | 推荐方式 | 原因 |
|------|:--------:|------|
| 需要合并多张表的列 | JOIN | 子查询做不到 |
| 只需要判断"是否存在" | EXISTS 子查询 | 语义更清晰 |
| 查询结果作为过滤条件 | IN 子查询 | 更直观 |
| 多表关联且返回右表列 | JOIN | 比子查询更高效 |
| 需要分步处理 | 子查询（FROM 中） | 逻辑清晰 |

> 💡 **性能经验：** 现代数据库优化器非常智能——在很多场景下，JOIN 和子查询的执行计划是一样的。**先写容易理解的，性能问题后面再优化**（用 `EXPLAIN` 分析）。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **INNER JOIN** | 只保留两表匹配的行 |
| **LEFT JOIN** | 左表全保留，右表无匹配补 NULL |
| **RIGHT JOIN** | 右表全保留 |
| **自连接（Self-Join）** | 同一张表通过别名和自己关联 |
| **子查询（Subquery）** | 查询嵌套查询 |
| **EXISTS** | 检查子查询是否有结果行 |

> 🎯 **小练习：** 给定 students(id, name)、courses(id, name) 和 enrollments(student_id, course_id, grade) 三张表，写出以下查询：
> 1. 查"没有选任何课的学生姓名"（提示：用 LEFT JOIN + WHERE NULL）
> 2. 查"选了所有课程的学生姓名"（提示：用 COUNT 和子查询）

**为什么先学这个？** JOIN 和子查询是 SQL 查询能力的核心。接下来学习 SQL 的三个进阶工具——[[sql-advanced|视图、索引与事务]]。
