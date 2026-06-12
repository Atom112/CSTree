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
---

## 内部 DSL vs 外部 DSL

| 类型 | 说明 | 例子 |
|:----:|------|------|
| **外部 DSL** | 独立语法，需完整解析 | SQL, regex, HTML |
| **内部 DSL** | 嵌入宿主语言中 | Ruby on Rails, jQuery |

```python
# 内部 DSL 例子——Python 的 SQLAlchemy
query = (Session.query(User)
         .filter(User.age > 18)
         .order_by(User.name))
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **DSL** | 专为特定领域设计的语言 |
| **外部 DSL** | 独立语言（SQL, regex） |
| **内部 DSL** | 嵌入宿主语言（流畅接口） |

**为什么先学这个？** 程序语言理论板块全部结束。接下来可以进入软件工程板块继续学习。
