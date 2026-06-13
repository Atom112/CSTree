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
updatedAt: 2026-06-13
---

## 🔧 基础 SQL 你已经会了——但还差这三样

上两节你学会了用 SQL 增删改查、可以 JOIN 多张表——这已经能应付大部分日常操作了。

但真正的"数据库老手"还会用三个进阶工具：

- **视图（View）**——简化复杂查询，像"保存的查询结果"
- **索引（Index）**——加速查询，像"书的目录"
- **事务（Transaction）**——保证多步操作"要么全做要么全不做"

---

## 👓 视图（View）——"保存一个查询"

视图本质上就是**一个保存下来的 SELECT 查询**。每次你查这个视图，数据库就重新执行它的 SELECT 语句。

### 为什么要用视图？

```sql
-- 没有视图：每次查学生成绩都要写这个复杂 JOIN
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id;

-- 创建视图：把这个查询"存起来"
CREATE VIEW student_grades AS
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id;

-- 之后查成绩就像查一张表一样简单
SELECT * FROM student_grades WHERE name = '张三';
```

> 🍜 **类比：外卖 App 上的"我的收藏"**
>
> 视图就是你把一些常点的菜品整理成了"我的收藏"列表——每次点餐不用重新搜索，直接打开收藏就行。
>
> 但注意：**视图不存数据**——它只是保存了查询逻辑。就像"我的收藏"并没有复制菜品，只是记住了菜品的 ID。

### 视图的实际用途

```sql
-- 1. 简化复杂查询（如上例）

-- 2. 限制数据访问（安全）
CREATE VIEW student_own_info AS
SELECT name, class_name FROM students;
-- 不给普通用户查全部学生信息，只给视图

-- 3. 提供向后兼容
-- 表结构改了，但旧代码还按老字段名查——创建一个同名的视图"假装"还是原来的表
```

> ⚠️ **视图的局限**：不是所有视图都能通过它修改数据。如果视图涉及多表 JOIN 或聚合函数，通常只能 SELECT，不能 INSERT/UPDATE/DELETE。

---

## ⚡ 索引（Index）——"数据快查通道"

索引是数据库里**加速查询**的数据结构，没有之一。

### 没有索引时发生了什么？

```sql
SELECT * FROM students WHERE name = '张三';
```

没有索引时，数据库要**从头到尾扫描整个 students 表**（全表扫描），一行一行地检查 name 是否等于"张三"。如果表里有 1000 万行，就要检查 1000 万次——非常慢。

### 创建索引

```sql
-- 在 name 列上创建索引
CREATE INDEX idx_student_name ON students(name);

-- 创建之后，同样的查询就快多了
SELECT * FROM students WHERE name = '张三';  -- 瞬间返回
```

### 索引的原理（简要）

索引的实现通常是 [[b-plus-tree|B+ 树]]（也可以是用[[hash-index|哈希索引]]）。它的查询速度大约是 O(log n)——1000 万行数据的查询只需要大约 3-4 次 I/O 操作。

> 📖 **类比：书的内容 vs 书末的索引**
>
> 没有索引 = 你要从头到尾翻一本书找"流水线"这个词在哪页。
>
> 有索引 = 翻到书末的索引页，查到"流水线"在第 203-210 页，直接翻过去。
>
> 书的内容 → 表的行
> 索引页 → 索引

### 复合索引——多列联合

```sql
-- 经常同时查 name 和 age，可以建复合索引
CREATE INDEX idx_name_age ON students(name, age);

-- 这个索引能加速以下查询：
SELECT * FROM students WHERE name = '张三' AND age = 20;  -- ✅ 完全匹配
SELECT * FROM students WHERE name = '张三';                -- ✅ 左前缀匹配
-- 但不能加速：
SELECT * FROM students WHERE age = 20;                     -- ❌ 跳过了左边的 name 列
```

复合索引的规则是**最左前缀原则**——索引 (A, B, C) 可以加速查 A、查 A+B、查 A+B+C，但不能加速查 B 或 C 单独。

### 索引的代价

**索引不是免费的：**

```sql
-- 每次插入/更新/删除数据时，索引也要同步更新
INSERT INTO students VALUES (4, '赵六', 22, '计科1班');
-- 不仅写了数据行，还更新了 idx_student_name 和 idx_name_age 两个索引
```

所以：**索引加速了 SELECT，但拖慢了 INSERT/UPDATE/DELETE。**

| 场景 | 建议 |
|------|------|
| 经常查的列 | 建索引 |
| 唯一性高的列（学号、邮箱） | 建索引效果好 |
| 很少查的列 | 不建索引 |
| 频繁增删改的表 | 少建索引 |
| 小表（几千行） | 不建索引也行，全表扫描很快 |

---

## 🔒 事务（Transaction）——"要么全做，要么全不做"

### 一个经典场景：转账

```sql
-- 张三给李四转账 100 元
UPDATE accounts SET balance = balance - 100 WHERE name = '张三';
-- 💥 如果这行代码执行完后、下一行执行前数据库崩溃了
UPDATE accounts SET balance = balance + 100 WHERE name = '李四';
```

张三扣了 100 元，但李四没收到——**钱丢了！**

### 用事务解决

```sql
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE name = '张三';
    UPDATE accounts SET balance = balance + 100 WHERE name = '李四';
COMMIT;
```

如果执行过程中出错，可以：

```sql
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE name = '张三';
    -- 发现出错了
ROLLBACK;  -- 回滚到事务开始前的状态——张三的 100 元又回来了
```

事务保证：**要么两条 UPDATE 都执行成功，要么都像没发生过一样。**

> 💸 **类比：支付宝转账**
>
> 你给同学转账 100 元——你这边"付款成功"显示的那一刻，后台实际上做了：
> 1. 你的账户扣 100 元 ✓
> 2. 同学的账户加 100 元 ✓
>
> 如果 1 做完后 2 失败了，整个事务回滚——你的钱会退回来。
>
> **你看到的"转账成功" = COMMIT 完成。**

### 事务的四大特性——ACID

事务有四个核心特性，统称 **ACID**。这里简单介绍，下一节会深入展开：

| 特性 | 含义 | 简单说 |
|:----:|------|--------|
| **原子性（Atomicity）** | 事务里的操作要么全做要么全不做 | 转账扣钱加钱都成功或都不做 |
| **一致性（Consistency）** | 事务前后数据都满足所有规则 | 转账后总金额不变 |
| **隔离性（Isolation）** | 并发的事务互不干扰 | 你转账时别人看到的是转完的结果 |
| **持久性（Durability）** | 提交后永久保存 | 转账成功后即使断电也不丢 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **视图（View）** | 保存的查询——像一张"虚拟表" |
| **索引（Index）** | 加速 WHERE 查询的数据结构——用空间换时间 |
| **复合索引** | 多列联合索引，遵循最左前缀原则 |
| **事务（Transaction）** | 一组操作要么全成功要么全回滚 |
| **ACID** | 事务的四大特性：原子性、一致性、隔离性、持久性 |
| **COMMIT** | 提交事务，让修改生效 |
| **ROLLBACK** | 回滚事务，撤销所有修改 |

> 🎯 **小练习：** 为什么在 `UPDATE accounts SET balance = balance + 100` 这种语句中，`balance + 100` 是**原子操作**吗？如果在执行过程中 CPU 被其他线程中断了会怎样？（提示：这属于下一节 [[acid|ACID 特性]] 的内容）

**为什么先学这个？** 事务的 ACID 特性是整个数据库可靠性的基石——需要在 [[acid|ACID 特性]] 中深入理解。同时索引的底层实现依赖于 [[b-plus-tree|B+ 树]] 和 [[hash-index|哈希索引]]，这些将在后面展开。
