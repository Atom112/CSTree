---
id: domain-specific-languages
title: 领域特定语言（DSL）
summary: DSL（Domain-Specific Language）是为特定领域设计的专用语言——SQL 是数据查询 DSL，正则表达式是文本匹配 DSL，HTML 是页面结构 DSL
difficulty: advanced
order: 14
parent: programming-paradigms
children: []
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - dsl
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔧 专用工具 vs 瑞士军刀

瑞士军刀什么都能干——可以切东西、开瓶盖、拧螺丝……但干每件事都不如专用工具好。

同样，通用编程语言（C、Python、Java）什么都能做——但对特定领域的表达不够"自然"。

**领域特定语言（Domain-Specific Language, DSL）** 就是为**一个特定领域**设计的语言——表达能力专精，语法简洁，用该领域的术语表达想法。

> 📐 **DSL 的定义**：为特定问题领域设计的、具有有限表达能力的编程语言（或标记语言）。

### 你每天都在用 DSL

```sql
-- SQL：数据查询领域的 DSL
SELECT name, avg(score) FROM students
JOIN scores ON students.id = scores.student_id
GROUP BY name HAVING avg(score) > 85;
```

```regex
-- 正则表达式：文本匹配领域的 DSL
\d{3}-\d{8}  -- 匹配电话号码：010-12345678
```

```html
<!-- HTML：网页结构领域的 DSL -->
<div class="article">
    <h1>标题</h1>
    <p>正文内容</p>
</div>
```

```css
/* CSS：样式领域的 DSL */
.article {
    font-size: 16px;
    color: #333;
    margin: 20px auto;
}
```

---

## 🏗️ 外部 DSL vs 内部 DSL

### 外部 DSL——有自己独立的语法和解析器

**外部 DSL（External DSL）** 是完全独立的语言——有自己的语法、词法分析器、解析器、解释器或编译器。

```sql
-- SQL 是外部 DSL——有完整的语法规范
-- 你需要一个 SQL 解析器来理解它
SELECT * FROM users WHERE age > 18 ORDER BY name;
```

```makefile
# Makefile——构建系统的 DSL
CC = gcc
CFLAGS = -Wall -O2

all: main

main: main.o utils.o
    $(CC) -o main main.o utils.o

%.o: %.c
    $(CC) $(CFLAGS) -c $<
```

**创建外部 DSL 需要**：
1. 定义语法（词法 + 文法规则）
2. 编写解析器（parser）
3. 实现语义（解释器或编译器）
4. 工具链（调试器、编辑器支持）

### 内部 DSL——嵌入在宿主语言中

**内部 DSL（Internal DSL）** 不是独立语言——它是利用宿主语言本身的特性，创造出"像 DSL"的 API 和编程风格。

```python
# SQLAlchemy——Python 的"数据库 DSL"
# 它看起来不像 Python，但实质上就是 Python
query = (
    session.query(User)
    .filter(User.age > 18)
    .filter(User.city == '北京')
    .order_by(User.name)
    .limit(10)
)
```

```ruby
# Ruby on Rails —— Ruby 的"Web DSL"
class Post < ApplicationRecord
    belongs_to :author
    has_many :comments
    
    validates :title, presence: true
    validates :body, length: { minimum: 10 }
end
```

```javascript
// jQuery —— JavaScript 的"DOM 操作 DSL"
$('.article')
    .css('color', 'red')
    .slideDown(200)
    .on('click', function() {
        alert('点击了文章');
    });
```

**创建内部 DSL 需要**：
1. 掌握宿主语言的语法特性（方法链、闭包、元编程）
2. 设计"流畅接口（Fluent Interface）"
3. 不需要解析器——宿主语言本身就是解析器

---

## ⚔️ 外部 DSL vs 内部 DSL

| 维度 | 外部 DSL | 内部 DSL |
|:----:|:--------:|:--------:|
| **语法灵活性** | 完全自由——你想怎么设计都行 | 受限于宿主语言的语法 |
| **开发成本** | 高——需要写解析器、编译器 | 低——利用宿主语言 |
| **学习曲线** | 需要学习全新语法 | 只需了解 API 设计 |
| **工具支持** | 需要自己写编辑器插件 | 复用宿主语言工具 |
| **性能** | 可针对性优化 | 受宿主语言限制 |
| **表达能力** | DSL 级别的精确表达 | 可以"逃回"通用语言 |
| **例子** | SQL、regex、HTML | Rails、jQuery、SQLAlchemy |

### 什么时候用哪种？

```
你的 DSL → 最终用户会用吗？
├─ 是 → 外部 DSL（SQL 被数据分析师直接用）
│      需要独立语法，用户不是程序员
│
└─ 否 → 内部 DSL（Rails 被 Ruby 程序员用）
        DSL 方便了开发，但不需独立语法
        
另外考虑：
需要跨语言使用？        → 外部 DSL
需要和宿主语言深度交互？  → 内部 DSL
```

---

## 🧩 DSL 的设计原则

### ① 用领域术语，不用编程术语

```sql
-- ❌ 非 DSL 风格
data.select().where("age").greater_than(18)

-- ✅ DSL 风格（SQL）
SELECT * FROM users WHERE age > 18
```

```python
# ❌ 非流畅接口
calculator = Calculator()
calculator.add(5)
calculator.add(3)
calculator.result()

# ✅ 流畅接口（类似 DSL）
result = (Calculator()
          .add(5)
          .add(3)
          .result())
```

### ② 只做一件事，但做到极致

```
SQL → 只做数据查询，但做得非常完整
     （你能用 SQL 表达的几乎所有查询，数据库都能优化执行）

regex → 只做文本匹配，但做得很透彻
       （从简单匹配到前瞻/后顾断言）
```

### ③ 限制表达能力——不是图灵完备的

大多数 DSL 故意**不是图灵完备的**（没有循环、条件分支等通用语言特性）：

```sql
-- SQL 不能做"无限循环"——这是一个有意的设计选择
-- 你无法用 SQL 写死循环
-- 每个查询必然终止

-- 正则表达式也无法表达"需要计数的模式"
-- 比如"匹配相同数量的 a 和 b"—正则做不到（不是图灵完备）
```

这其实是一个**优势**——DSL 的限制使其更安全、更容易分析、更容易优化。

---

## 📊 DSL 的经典案例

| DSL | 领域 | 类型 | 语法片段 |
|:---:|:----:|:----:|---------|
| **SQL** | 数据库查询 | 外部 | `SELECT * FROM users` |
| **Regex** | 文本匹配 | 外部 | `\d{4}-\d{2}-\d{2}` |
| **HTML/CSS** | 网页结构/样式 | 外部 | `<div class="main">` |
| **Makefile** | 构建系统 | 外部 | `target: dependencies` |
| **Graphviz DOT** | 图形描述 | 外部 | `A -> B [label="edge"]` |
| **Rails** | Web 框架 | 内部 | `has_many :comments` |
| **jQuery** | DOM 操作 | 内部 | `$('.cls').hide()` |
| **LATEX** | 排版 | 外部 | `\section{Introduction}`|
| **Protocol Buffers** | 数据序列化 | 外部 | `message Person { string name = 1; }`|

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **DSL（领域特定语言）** | 为特定领域设计的专用语言 |
| **外部 DSL** | 独立语法，需要解析器（SQL、regex、HTML）|
| **内部 DSL** | 利用宿主语言特性（Rails、jQuery、SQLAlchemy）|
| **流畅接口（Fluent Interface）** | 方法链式调用——让代码"读起来像句子"|
| **DSL 的设计原则** | 领域术语、专注一件事、有限表达 |
| **非图灵完备** | DSL 通常故意不做成通用语言——更安全、可优化 |

> 🎯 **小练习**：Python 的 `with` 语句可以用来创建 DSL 风格的小语言。试试用 `__enter__` 和 `__exit__` 方法实现一个简单 DSL——让用户这样写：
> ```python
> with html():
>     with body():
>         with h1():
>             text("Hello, DSL!")
> ```

**为什么先学这个？** 程序语言理论板块到此全部结束。14 个节点带你从"编程范式"走到了"领域特定语言"。接下来可以进入软件工程板块继续学习。
