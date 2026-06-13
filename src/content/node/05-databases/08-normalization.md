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
updatedAt: 2026-06-13
---

## 🧹 一张设计糟糕的表——和一串连锁问题

上一节我们看到了一个"坏设计"：

```sql
CREATE TABLE bad_schema (
    student_id INT,
    student_name VARCHAR(50),
    dept_name VARCHAR(50),
    dean_name VARCHAR(50),
    course_name VARCHAR(100),
    grade INT
);
```

想象一下这个表里实际的数据长什么样：

```
学号 │姓名  │系名    │院长    │课程名    │成绩
────┼─────┼───────┼───────┼─────────┼────
001 │张三 │计算机 │王教授  │数据结构  │ 85
001 │张三 │计算机 │王教授  │操作系统  │ 92
001 │张三 │计算机 │王教授  │数据库    │ 88
002 │李四 │计算机 │王教授  │数据结构  │ 78
003 │王五 │物理   │陈教授  │高数      │ 90
003 │王五 │物理   │陈教授  │力学      │ 85
```

你能看出问题吗？

1. **冗余**："王教授"这个名字在计算机系学生的每行上都重复出现了
2. **更新异常**：如果王教授换成"张教授"，你要更新所有计算机系的行
3. **插入异常**：新成立了一个"人工智能系"，但还没学生选课——系和院长的信息存不进去
4. **删除异常**：如果把王五的所有选课记录删了，物理系和陈教授的信息也跟着消失了

**范式（Normalization）就是解决这些问题的系统方法。** 它通过将表拆分成更小的、结构更合理的表，逐步消除各种"异常"。

> 🧳 **类比：整理宿舍行李**
>
> 你开学把所有东西都塞进了一个大行李箱——衣服、书本、充电器、洗漱用品混在一起。结果找东西要翻半天，想拿充电器得把衣服全掏出来。
>
> 规范化就是把这些东西分门别类整理好：
> - 衣服放衣柜（衣服表）
> - 书本放书架（书籍表）
> - 充电器放抽屉（配件表）
>
> 每个东西只在一个地方——找东西快，也不会搞丢。

---

## 📏 第一范式（1NF）——每列都是原子的

**规则**：表中的每个单元格**只能存一个值**，不能存列表或集合。

### 违反 1NF 的例子

```
学号 │姓名  │课程
────┼─────┼────────
001 │张三 │数据结构, 操作系统, 数据库
002 │李四 │数据结构
```

"课程"列里存了多个值——这不满足 1NF。

### 如何修复

把每个课程值单独成行：

```
学号 │姓名  │课程
────┼─────┼───────
001 │张三 │数据结构
001 │张三 │操作系统
001 │张三 │数据库
002 │李四 │数据结构
```

现在每个单元格都是"原子"的——1NF 满足。

> 💡 **实践中的 1NF**：绝大多数现代数据库设计**天然满足 1NF**。违反 1NF 更像是"把 Excel 习惯带到了数据库"。

---

## 📏 第二范式（2NF）——消除部分依赖

**规则**：满足 1NF，且**非主键列必须完全依赖于主键**（不能只依赖于主键的一部分）。

### 违反 2NF 的例子

```sql
-- 联合主键：(student_id, course_name)
CREATE TABLE enrollments_2nf_violation (
    student_id INT,
    course_name VARCHAR(100),
    student_name VARCHAR(50),  -- 只依赖于 student_id（主键的一部分）
    dept_name VARCHAR(50),      -- 只依赖于 student_id
    grade INT,                  -- 完全依赖于 (student_id, course_name) ✅
    PRIMARY KEY (student_id, course_name)
);
```

这里主键是 (student_id, course_name)，但 `student_name` 和 `dept_name` 只需要 `student_id` 就能确定——它们**部分依赖于主键**。

### 如何修复

拆成两张表：

```sql
-- 表 1：学生信息（主键 student_id）
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(50),
    dept_name VARCHAR(50)
);

-- 表 2：选课成绩（联合主键 student_id, course_name）
CREATE TABLE enrollments (
    student_id INT,
    course_name VARCHAR(100),
    grade INT,
    PRIMARY KEY (student_id, course_name),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

> 💡 **2NF 的触发条件**：只有使用**联合主键**时才可能出现部分依赖。如果你用的是单列主键，你的表天然满足 2NF。

---

## 📏 第三范式（3NF）——消除传递依赖

**规则**：满足 2NF，且**非主键列不传递依赖于主键**（非主键列不能依赖于其他非主键列）。

### 违反 3NF 的例子

```sql
CREATE TABLE students_3nf_violation (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(50),
    dept_name VARCHAR(50),
    dean_name VARCHAR(50)  -- 依赖于 dept_name，而 dept_name 依赖于 student_id
);
```

函数依赖关系：`student_id → dept_name → dean_name`（传递依赖）

问题：院长信息通过系名"间接"关联到学生——导致冗余和更新异常。

### 如何修复

再拆一张表：

```sql
-- 表 1：学生信息
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(50),
    dept_name VARCHAR(50),
    FOREIGN KEY (dept_name) REFERENCES departments(dept_name)
);

-- 表 2：院系信息
CREATE TABLE departments (
    dept_name VARCHAR(50) PRIMARY KEY,
    dean_name VARCHAR(50)
);
```

现在院长信息只存一次在院系表中，不会重复。学生表中的 `dept_name` 只是一个外键引用。

> 🧩 **类比：快递站和收货地址**
>
> 你在淘宝上买了三样东西，收货地址都是"学校 12 号楼 301 宿舍"。
>
> **违反 3NF**：每个订单都存一遍"12 号楼 301 宿舍"——如果搬家了，每个订单都要改地址。
>
> **满足 3NF**：地址存一次，订单通过"地址 ID"引用。
>
> 其实 3NF 的核心思想就是一个原则：**一件事只在一个地方存**（一事一地）。

---

## 📏 BCNF（Boyce-Codd Normal Form）——更严格的 3NF

**规则**：满足 3NF，且**每个决定因素（箭头左边）都必须是候选键**。

BCNF 和 3NF 的区别很微妙。看一个例子：

```sql
CREATE TABLE teaching (
    student_id INT,
    course_name VARCHAR(100),
    instructor_name VARCHAR(50),
    PRIMARY KEY (student_id, course_name)
);
```

假设有附加规则：**每位老师只教一门课**（instructor_name → course_name）。

这违反 BCNF 吗？检查一下：

- 候选键是 (student_id, course_name)
- instructor_name → course_name —— **instructor_name 不是候选键，但它决定了 course_name（候选键的一部分）**

所以这违反了 BCNF。但它是 3NF 吗？是的——因为 `course_name` 是候选键的一部分，而 3NF 对"候选键的一部分"有豁免。

### 如何修复

```sql
-- 表 1：学生选老师
CREATE TABLE enrollment_instructor (
    student_id INT,
    instructor_name VARCHAR(50),
    PRIMARY KEY (student_id, instructor_name)
);

-- 表 2：老师教课程
CREATE TABLE instructor_course (
    instructor_name VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(100)
);
```

**BCNF 和 3NF 的取舍**：BCNF 消除了所有基于函数依赖的异常，但可能损失一些"自然的"约束表达能力。在实际工程中，**3NF 已经足够好**，BCNF 更多是理论上的完美。

---

## 🗺️ 范式全景图

```
1NF  →  原子值（每列不可再分）
 ↓
2NF  →  消除部分依赖（非主键列完全依赖主键）
 ↓
3NF  →  消除传递依赖（非主键列不依赖其他非主键列）
 ↓
BCNF →  每个决定因素都是候选键
```

**设计建议**：大多数实际项目做到 **3NF** 就够了。BCNF 通常是"锦上添花"的追求。

---

## 📝 小结

| 范式 | 解决的问题 | 核心规则 |
|:----:|-----------|---------|
| **1NF** | 非原子列 | 每个单元格只存一个值 |
| **2NF** | 部分依赖 | 非主键列不能只依赖主键的一部分 |
| **3NF** | 传递依赖 | 非主键列不能依赖于其他非主键列 |
| **BCNF** | 决定因素非键 | 箭头左边必须是候选键 |

> 🎯 **小练习**：分析下面这张表属于第几范式，如何优化？
>
> 订单表（订单ID, 客户名, 客户地址, 商品名, 商品价格, 数量）
> 函数依赖：订单ID → 客户名, 客户地址
> 客户名 → 客户地址
> 商品名 → 商品价格

**为什么先学这个？** 规范化减少冗余但可能带来性能问题——有时为了查询性能，我们需要故意"保留一些冗余"。下一步看看[[denormalization|规范化与反规范化]]之间的权衡。
