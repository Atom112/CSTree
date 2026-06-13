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
updatedAt: 2026-06-13
---

## 💬 学会和数据库"对话"

上一节学了关系模型——你知道数据在"表"里，可以用集合运算来操作。

但问题来了：**你怎么让数据库执行这些操作？**

你不能直接对着 MySQL 说"给我做一个选择运算"——你得说它"听得懂"的语言。这个语言就是 **SQL（Structured Query Language，结构化查询语言）**。

> 🏪 **类比：在食堂打饭**
>
> 关系代数就像"菜谱上的做法描述"（把西红柿和鸡蛋混合翻炒）——精确但不够直观。
>
> SQL 就像你直接对食堂阿姨说的"一份番茄炒蛋，不要葱"——简单直接，阿姨一听就懂。
>
> 食堂阿姨（数据库）听到你的话后，内部还是按照"菜谱"（关系代数）来做菜的。

SQL 分为两大部分：

- **DDL（Data Definition Language，数据定义语言）**——用来定义表的结构（建表、改表、删表）
- **DML（Data Manipulation Language，数据操作语言）**——用来操作表中的数据（增、删、改、查）

---

## 🏗️ DDL —— 给你的数据"搭架子"

在存数据之前，得先定义好数据长什么样。这就像**做饭前先把菜切好、把盘子准备好**。

### CREATE TABLE —— 创建表

```sql
CREATE TABLE students (
    id INT PRIMARY KEY,           -- 学号，整数类型，主键
    name VARCHAR(50) NOT NULL,     -- 姓名，最大50个字符，不能为空
    age INT CHECK (age > 0),       -- 年龄，整数，必须大于0
    email VARCHAR(100) UNIQUE,     -- 邮箱，最大100字符，不能重复
    class_name VARCHAR(30)         -- 班级
);
```

这条 SQL 做了什么事？它创建了一张"学生表"，规定了每一列的名字、类型和约束。

**常见约束（Constraint）：**

| 约束 | 含义 | 类比 |
|:----:|------|------|
| `PRIMARY KEY` | 主键，唯一标识一行 | 身份证号——不能重复，不能为空 |
| `NOT NULL` | 不能为空 | 入学注册时"姓名"必填 |
| `UNIQUE` | 不能重复 | 学号不能两个人一样 |
| `CHECK` | 满足条件 | 年龄必须大于 0 |
| `FOREIGN KEY` | 引用其他表的主键 | 成绩表中的学号必须在学生表中存在 |

> 💡 **FOREIGN KEY** 和 ER 模型中讲的外键是一回事——它保证了"引用完整性"：如果你在成绩表中写了学号 999，但这个学号在学生表中不存在，数据库会直接报错。

### ALTER TABLE —— 修改表

```sql
-- 添加新列
ALTER TABLE students ADD COLUMN phone VARCHAR(20);

-- 删除列
ALTER TABLE students DROP COLUMN phone;

-- 修改列类型
ALTER TABLE students MODIFY COLUMN age SMALLINT;
```

### DROP TABLE —— 删除表

```sql
DROP TABLE students;  -- 表和数据全部删除，慎重！
```

> ⚠️ **课堂事故警告**：很多初学者在测试环境执行了 `DROP TABLE students;` 之后才发现——没有"撤销"按钮。**生产环境删表前一定要再三确认**。

---

## 🛠️ DML —— 真正操作数据

表结构搭好后，就可以往里塞数据了。DML 就是操作数据的四**板斧**：增、删、改、查。

### INSERT —— 插入数据

```sql
-- 插入一条完整记录
INSERT INTO students VALUES (1, '张三', 20, 'zhangsan@example.com', '计科1班');

-- 只插入指定列（其他列用默认值或 NULL）
INSERT INTO students (id, name, age) VALUES (2, '李四', 21);
```

### SELECT —— 查询数据

```sql
-- 查所有列
SELECT * FROM students;

-- 查指定列
SELECT name, age FROM students;

-- 带条件查询
SELECT * FROM students WHERE age > 18;

-- 排序
SELECT * FROM students ORDER BY age DESC;

-- 限制返回行数
SELECT * FROM students LIMIT 10;

-- 去重
SELECT DISTINCT class_name FROM students;
```

`SELECT` 是 SQL 中使用频率最高的操作，也是接下来几节会不断深化的内容。这里先记住最基本的用法。

### UPDATE —— 更新数据

```sql
-- 把张三的年龄改成 21
UPDATE students SET age = 21 WHERE id = 1;

-- 也可以同时改多列
UPDATE students SET age = 21, class_name = '计科2班' WHERE id = 1;
```

> ⚠️ **重要：永远别忘记 WHERE**！如果不加 WHERE，`UPDATE students SET age = 21` 会把**所有学生**的年龄都改成 21。

### DELETE —— 删除数据

```sql
-- 删除学号为 1 的学生
DELETE FROM students WHERE id = 1;

-- 删除所有年龄小于 18 的学生
DELETE FROM students WHERE age < 18;

-- 删除全部数据（但保留表结构）
DELETE FROM students;
```

和 UPDATE 一样——**不加 WHERE 就是全删**。

---

## 🎯 用"选课系统"把 SQL 串起来

让我们用刚刚学到的知识，为上一节的选课系统创建完整的表结构：

```sql
-- 1. 创建学生表
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT,
    class_name VARCHAR(30)
);

-- 2. 创建课程表
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT
);

-- 3. 创建选课记录表（外键关联）
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    grade INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

**注意到 enrollments 表的主键是 (student_id, course_id) 的组合主键**——因为这正好表达"一个学生选了一门课"的唯一关系，不会出现同一个学生重复选同一门课的情况。

---

## 📋 数据类型速查

SQL 中每一列都需要指定数据类型——这和你学过的 C 语言/汇编中的数据类型是类似的概念：

| 类别 | 类型 | 说明 |
|:----:|------|------|
| 整数 | `INT`, `BIGINT`, `SMALLINT` | 分别对应 4/8/2 字节整数 |
| 浮点 | `FLOAT`, `DOUBLE`, `DECIMAL(10,2)` | DECIMAL 适合存金额（精确小数） |
| 字符串 | `VARCHAR(n)`, `CHAR(n)`, `TEXT` | VARCHAR 变长，CHAR 定长 |
| 日期时间 | `DATE`, `DATETIME`, `TIMESTAMP` | 日期/日期时间/时间戳 |
| 布尔 | `BOOLEAN` | true/false |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **SQL** | 操作关系数据库的标准语言——"和数据库对话" |
| **DDL** | 定义表结构的语言（CREATE, ALTER, DROP） |
| **DML** | 操作数据（INSERT, SELECT, UPDATE, DELETE） |
| **主键（PRIMARY KEY）** | 唯一标识一行，不能重复不能为空 |
| **外键（FOREIGN KEY）** | 引用其他表的行，保证引用完整性 |
| **WHERE 条件** | 不加 WHERE = 操作所有行——这是个危险习惯 |

> 🎯 **小练习：** 试着自己为"图书馆借书系统"设计表结构——读者表、图书表、借书记录表——并用 DDL 写出来。

**为什么先学这个？** 掌握基础的增删改查后，下一步学习 SQL 最强大的功能——把多张表的信息合并在一起查询：[[sql-joins|连接查询与子查询]]。
