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
---

## ORM 示例

```python
# Django ORM——用 Python 对象操作数据库
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

# 查询——不需要写 SQL
users = User.objects.filter(name__startswith='张')
user = User.objects.get(id=1)
user.name = '新名字'
user.save()  # 自动生成 UPDATE
```

## ORM 的优缺点

| 优点 | 缺点 |
|:----:|:----:|
| 开发快，不需要写 SQL | N+1 查询问题 |
| 防 SQL 注入 | 复杂查询难优化 |
| 数据库无关 | 性能不如手写 SQL |

**为什么先学这个？** 数据存储后，需要[[security-coding|安全编程实践]]。
