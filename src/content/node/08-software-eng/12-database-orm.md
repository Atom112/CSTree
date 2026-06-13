---
id: database-orm
title: 数据库设计与 ORM
summary: ORM（对象关系映射）把关系数据库的表映射到编程语言的对象——让你用面向对象的方式操作数据库，不用写 SQL
difficulty: intermediate
order: 12
parent: api-design
children: []
related: []
prerequisites:
  - api-design
tags:
  - software-eng
  - orm
  - database
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🌉 编程语言的世界和数据库的世界——语言不通

你在 Python 中操作数据是"对象"：

```python
user = User(name="张三", age=20)
print(user.name)  # "张三"
```

但数据库里存的是"关系"(表)：

```
users 表：
┌────┬──────┬─────┐
│ id │ name │ age │
├────┼──────┼─────┤
│ 1  │ 张三  │ 20  │
└────┴──────┴─────┘
```

这两个世界**语言不通**——编程语言是"对象/类"，数据库是"表/行/列"。**ORM（Object-Relational Mapping，对象关系映射）** 就是这两个世界之间的"翻译官"。

> 📖 **类比：翻译官**
>
> 中国人在法国餐厅吃饭——他不会说法语，服务员不会说中文。需要**翻译官**（ORM）来沟通：
>
> 中国人（Python）："我要一份鱼香肉丝"
> 翻译官（ORM）："Je voudrais un porc aigre-doux, s'il vous plaît"
> 服务员（数据库）：记下订单
>
> 翻译官不需要你懂法语——你只需要用中文点菜，翻译官帮你处理"沟通细节"（SQL）。

---

## 🏢 ORM 的工作原理

ORM 把**数据库的表**映射成**编程语言的类**：

```python
# Django ORM——Python 中最流行的 ORM 之一
from django.db import models

# 定义模型（Model）——相当于"建表"
class User(models.Model):
    name = models.CharField(max_length=100)     # VARCHAR(100)
    email = models.EmailField(unique=True)      # VARCHAR(100) UNIQUE
    age = models.IntegerField()                 # INT
    created_at = models.DateTimeField(auto_now_add=True)  # TIMESTAMP
    
    class Meta:
        db_table = "users"  # 对应的数据库表名

# 使用 ORM 操作数据——完全不用写 SQL

# 创建（INSERT）
user = User(name="张三", email="z@example.com", age=20)
user.save()  
# ← 自动生成：INSERT INTO users (name, email, age) VALUES ('张三', 'z@example.com', 20)

# 查询（SELECT）
users = User.objects.filter(age__gt=18)  # 年龄 > 18
for u in users:
    print(u.name)
# ← 自动生成：SELECT * FROM users WHERE age > 18

# 更新（UPDATE）
user = User.objects.get(id=1)
user.name = "李四"
user.save()
# ← 自动生成：UPDATE users SET name='李四' WHERE id=1

# 删除（DELETE）
user.delete()
# ← 自动生成：DELETE FROM users WHERE id=1
```

---

## ⚡ ORM 的好处

| 好处 | 说明 |
|:----:|------|
| **开发效率高** | 不用写 SQL，直接调用方法 |
| **防 SQL 注入** | ORM 自动处理参数转义 |
| **数据库无关** | 换数据库（MySQL → PostgreSQL）只需改配置，不换代码 |
| **自动迁移** | 改模型 → 自动生成 ALTER TABLE 语句 |
| **关系管理** | 外键关系通过对象属性访问 |

```python
# ORM 的关系管理——最强大的特性之一

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

# 通过 ORM 的"关系链"访问关联数据
user = User.objects.get(id=1)
orders = user.order_set.all()  # 获取这个用户的所有订单——自动 JOIN
```

---

## ⚠️ ORM 的坑——以及怎么避免

### 坑 1：N+1 查询问题

```python
# ❌ 性能灾难——N+1 查询
users = User.objects.all()  # 1 条 SQL：SELECT * FROM users

for user in users:  # N 条 SQL：每个 user 查一次
    print(user.order_set.count())  # 循环 N 次：SELECT COUNT(*) FROM orders WHERE user_id=?
    
# 总共：1 + N 条 SQL——如果 1000 个用户 → 1001 条 SQL！

# ✅ 修复——用 prefetch_related 预加载
users = User.objects.prefetch_related('order_set').all()  # 2 条 SQL
for user in users:
    print(user.order_set.count())  # 不再发 SQL，用缓存数据
```

### 坑 2：复杂查询性能不如手写 SQL

```python
# ORM 生成的 SQL 可能不是最优的
complex_query = (Order.objects
    .filter(user__age__gt=18, total__gt=100)
    .annotate(item_count=Count('items'))
    .filter(item_count__gt=3)
    .order_by('-total'))

# 如果发现这条 ORM 查询生成的 SQL 效率低
# 可以用"原生 SQL"替代
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT o.*, COUNT(oi.id) as item_count
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        WHERE u.age > 18 AND o.total > 100
        GROUP BY o.id
        HAVING COUNT(oi.id) > 3
        ORDER BY o.total DESC
    """)
```

### 坑 3：懒加载（Lazy Loading）的陷阱

```python
# 在 ORM 中，关联数据默认"懒加载"
# ——直到真正用到的时候才查询

user = User.objects.get(id=1)  # SQL: SELECT * FROM users WHERE id=1

# 这里没有查 orders——user.order_set 是"懒加载"的
# 但是如果你在模板中访问：
# {{ user.order_set.count }}
# 才触发 SQL：SELECT COUNT(*) FROM orders WHERE user_id=1
```

---

## 🔧 ORM vs 手写 SQL——选择指南

| 场景 | 推荐 | 原因 |
|:----:|:----:|------|
| **标准 CRUD** | ORM | 开发快、安全 |
| **简单查询（单表）** | ORM | 代码少、可读性好 |
| **复杂 JOIN 查询** | 手写 SQL | ORM 生成的 SQL 可能效率低 |
| **报表/聚合查询** | 手写 SQL | 需要精细控制查询计划 |
| **批量操作** | ORM + 批量 API | 但要注意 N+1 |
| **性能关键路径** | 手写 SQL | 全控制 |

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **ORM（对象关系映射）** | 把表映射成类——用对象方式操作数据库 |
| **优点** | 开发快、防注入、数据库无关 |
| **N+1 问题** | 循环查询导致性能灾难——用 prefetch_related 解决 |
| **懒加载（Lazy Loading）** | 关联数据默认延迟加载——用到时才查 |
| **何时手写 SQL** | 复杂查询、报表、性能关键路径 |

> 🎯 **小练习**：你的系统有两个表——`Author`（作者）和 `Book`（书籍），一对多关系。用你熟悉的 ORM（Django、SQLAlchemy 等）定义这两个模型，并写出以下查询的 ORM 代码和对应的 SQL："查询所有写过 3 本以上书籍的作者，按书籍数量降序排列"。

**为什么先学这个？** 处理好数据存储了，但还要保证数据的安全——[[security-coding|安全编程实践]]。
