---
id: requirements-analysis
title: 需求获取与分析
summary: 需求分析（Requirements Analysis）是确定"系统应该做什么"的过程——功能需求描述行为，非功能需求描述质量属性（性能、安全、可用性）
difficulty: intermediate
order: 4
parent: software-lifecycle
children:
  - software-architecture
related: []
prerequisites:
  - software-lifecycle
tags:
  - software-eng
  - requirements
createdAt: 2026-06-12
---

## 需求类型

| 类型 | 例子 |
|:----:|------|
| **功能需求** | 用户能登录、能搜索商品 |
| **非功能需求** | 响应时间 < 200ms，支持 10000 并发 |
| **约束** | 必须用 PostgreSQL，团队 5 人 |

## 用户故事

```
作为 <角色>
我希望 <功能>
以便 <价值>

如：作为用户，我希望搜索商品，以便快速找到想买的东西。
```

**为什么先学这个？** 需求明确后，进行[[software-architecture|软件架构与设计模式]]。
