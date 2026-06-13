---
id: query-optimization
title: 查询执行与优化
summary: 查询优化器（Query Optimizer）把 SQL 翻译成执行计划——选择索引、决定 JOIN 顺序、估算代价——让同样的查询跑得更快
difficulty: advanced
order: 12
parent: database-overview
children: []
related:
  - b-plus-tree
prerequisites:
  - sql-basics
  - b-plus-tree
tags:
  - database
  - query
  - optimization
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🤯 同一个 SQL，为什么有时快有时慢？

你有没有过这种经历：同事写了一条 SQL 查询，跑了几秒就返回了；你写了一条功能上完全一样的 SQL，却跑了 30 秒——甚至把数据库"查崩了"。

```sql
-- 查询 A：瞬间返回
SELECT o.*, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2026-01-01';

-- 查询 B：慢慢慢
SELECT o.*, c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= '2026-01-01';
```

等等——这两条 SQL 的区别只是**表的顺序**（`orders JOIN customers` vs `customers JOIN orders`），但结果不是一样的吗？

**对结果来说是一样的，但数据库执行它们的方式可能完全不同。** 而"方式的不同"决定了是快还是慢。

> 🧭 **类比：高德地图导航**
>
> 你想从学校到火车站。
>
> **查询优化器就像高德地图的路径规划引擎**——你告诉它"从学校到火车站"（SQL 查询），它内部会：
> 1. 列出所有可能的路线（各种执行计划）
> 2. 估算每条路线的耗时（代价估算）
> 3. 选择最快的那条路线（选择最优执行计划）
>
> 你知道"最佳路线是哪条"吗？不需要——高德帮你算了。同样，你也不需要告诉数据库"怎么查"，数据库自己决定。

---

## 🏗️ SQL 查询的执行过程

一条 SQL 从输入到返回结果，经历了这些步骤：

```
你的 SQL：
SELECT s.name, c.course_name, e.grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE e.grade >= 60;
         │
         ▼
第 1 步：解析（Parser）
  └→ 检查 SQL 语法是否正确
  └→ 生成"解析树"（Parse Tree）
         │
         ▼
第 2 步：语义分析（Semantic Analysis）
  └→ 检查表名、列名是否存在
  └→ 检查用户是否有权限
         │
         ▼
第 3 步：查询优化（Optimization）
  └→ 生成多个可能的执行计划
  └→ 估算每个计划的代价
  └→ 选择代价最小的计划
         │
         ▼
第 4 步：执行（Execution）
  └→ 按照选定的执行计划实际获取数据
  └→ 返回结果
```

**最关键的是第 3 步——优化。** 同一个 SQL 可能对应几十个甚至几百个不同的执行计划，优化器的任务就是在短时间内找到最好的那个。

---

## 🔍 常用优化技术

### ① 索引选择（Index Selection）

优化器根据 WHERE 条件判断哪个索引最有效：

```sql
SELECT * FROM students WHERE name = '张三' AND age > 20;
```

如果 name 和 age 上都有索引，优化器会选择哪个？

- 如果 name 的唯一性更高（"张三"只匹配几行）→ 用 name 索引
- 如果 age > 20 匹配了 90% 的行 → 可能直接全表扫描更快
- 如果有一个复合索引 (name, age) → 最优

> 💡 **你怎么知道优化器选了哪个索引？** 用 `EXPLAIN` 命令：

```sql
EXPLAIN SELECT * FROM students WHERE name = '张三';
-- 输出中会显示用了哪个索引（possible_keys, key 字段）
```

### ② JOIN 重排（Join Reordering）

优化器会决定**先 JOIN 哪张表**。核心原则是：**先处理小表，减少中间结果的大小。**

```sql
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id;
```

假设数据量：
- customers：10,000 行
- orders：1,000,000 行
- order_items：5,000,000 行

如果优化器先 JOIN customers 和 orders（小表先 JOIN），中间结果最多 100 万行。如果先把 orders 和 order_items 做 JOIN，中间结果可能 500 万行——差 5 倍。

> 🧩 **类比：整理错题本**
>
> 你要整理"数学考试中做错的、关于函数的选择题"。
>
> **有效的方式**：先把范围缩小到"数学考试"（小集合），再过滤"做错的"，最后限制为"函数 + 选择题"。
>
> **无效的方式**：先找所有"函数"相关 → 再找"选择题" → 再找"数学考试" → 每一步中间结果都很大。
>
> 先处理哪个条件（相当于先 JOIN 哪张表），直接决定了处理的数据量。

### ③ 谓词下推（Predicate Pushdown）

**尽量早地过滤数据**——在 JOIN 之前先做完 WHERE 过滤：

```sql
-- 优化器可能会把你的查询改写成这样：
-- 原始查询：
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.age > 18 AND o.amount > 100;

-- 优化后的执行逻辑：
-- 1. 先从 customers 中过滤出 age > 18 的行（少量客户）
-- 2. 先从 orders 中过滤出 amount > 100 的行（少量订单）
-- 3. 再把两个小结果集 JOIN 在一起
```

这样 JOIN 处理的数据量大大减少。

### ④ 投影下推（Projection Pushdown）

**只 SELECT 需要的列**，不要用 `SELECT *`：

```sql
-- 慢：SELECT * 把不需要的列也传给了 JOIN
SELECT * FROM students s
JOIN enrollments e ON s.student_id = e.student_id;

-- 快：只选需要的列，中间结果更小
SELECT s.name, e.grade FROM students s
JOIN enrollments e ON s.student_id = e.student_id;
```

---

## 📊 代价估算（Cost Estimation）

优化器是怎么判断哪个计划"更优"的？它给每个操作**估算一个代价（Cost）**，然后选总代价最小的。

代价估算考虑的因素：

| 因素 | 说明 | 优化器从哪里知道？ |
|:----:|------|-------------------|
| **行数** | 每个表有多少行 | 表的统计信息（行数记录） |
| **选择性** | WHERE 条件过滤掉多少行 | 列的统计信息（不同值个数） |
| **索引情况** | 是否有合适的索引 | 索引元数据 |
| **数据分布** | 某列的值分布是否均匀 | 直方图统计 |

### 统计信息的重要性

优化器的决策依赖于**统计信息**。如果统计信息不准确，优化器可能做出糟糕的选择：

```sql
-- 更新统计信息
ANALYZE TABLE students;

-- 查看表的统计信息
SHOW TABLE STATS;
```

**一个典型的优化器选错索引的场景：**

某张表的某个列上虽然有索引，但该列 90% 的值都是同一个（比如 status = 'active'，而大部分行都处于 active 状态）。优化器知道这个分布后——对于 `WHERE status = 'active'` 的查询，会选择**全表扫描而不是用索引**，因为用索引反而更慢（大量回表操作）。

---

## 🚫 常见"写坏 SQL"的行为

```sql
-- ❌ 不要在 WHERE 条件中对列做计算
WHERE YEAR(order_date) = 2026;     -- 无法使用索引
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';  -- ✅ 可以使用索引

-- ❌ 不要在 WHERE 中对列做函数操作
WHERE UPPER(name) = 'ZHANGSAN';    -- 无法使用索引
WHERE name = 'ZhangSan' COLLATE utf8_general_ci;  -- ✅ 使用不区分大小写的排序规则

-- ❌ 用 OR 连接不同列可能导致索引失效
WHERE name = '张三' OR age = 20;   -- 可能无法使用索引
-- 如果两个索引都存在，优化器可能还勉强能用
-- 更好的办法是改成 UNION ALL 两个查询

-- ❌ 数据量少的场景 NULL 和 NOT IN 可能很慢
WHERE name NOT IN ('张三', '李四');  -- 大数据量下考虑用 LEFT JOIN
```

---

## 🛠️ 使用 EXPLAIN 分析查询

在 MySQL/PostgreSQL 中，`EXPLAIN` 是分析查询性能最重要的工具：

```sql
EXPLAIN SELECT s.name, c.course_name
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.age > 18;
```

输出通常包含：

| 字段 | 含义 | 好的信号 | 坏的信号 |
|:----:|------|---------|---------|
| **type** | 访问方式 | `const`, `ref`, `range` | `ALL`（全表扫描） |
| **key** | 使用的索引 | 有索引名 | NULL（没有用索引） |
| **rows** | 估算扫描行数 | 少 | 多 |
| **Extra** | 额外信息 | `Using index` | `Using filesort`, `Using temporary` |

> 💡 **实用建议**：每次在正式环境跑新 SQL 之前，先 `EXPLAIN` 一下——早期发现问题比上线后出问题好得多。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **查询优化器** | 自动选择最高效的执行计划——就像导航规划路线 |
| **索引选择** | 根据 WHERE 条件决定用哪个索引 |
| **JOIN 重排** | 小表先 JOIN，减少中间结果 |
| **谓词下推** | 先过滤再 JOIN |
| **代价估算** | 基于统计信息估算每个操作的"成本" |
| **EXPLAIN** | 查看执行计划的命令——SQL 性能分析的第一步 |

> 🎯 **小练习**：用 EXPLAIN 分析不同的 JOIN 写法，看看优化器在不同数据库（如 MySQL、PostgreSQL）中是否会选择不同的执行计划。

**为什么先学这个？** 理解了 SQL 如何被执行和优化，你才能写出真正高效的数据库应用。接下来进入数据库最复杂也最重要的主题——事务。[[acid|ACID 特性]]。
