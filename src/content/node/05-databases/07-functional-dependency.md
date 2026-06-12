---
id: functional-dependency
title: 函数依赖
summary: 函数依赖（Functional Dependency）描述表中列之间的"决定关系"——如果学号确定，姓名就唯一确定，就说"学号 → 姓名"
difficulty: advanced
order: 7
parent: database-overview
children:
  - normalization
related: []
prerequisites:
  - database-overview
tags:
  - database
  - normalization
  - dependency
createdAt: 2026-06-12
---

## 列之间的"决定关系"

函数依赖 X → Y 表示：给定 X 的值，Y 的值就被唯一定义。

```
学号 → 姓名（知道学号就知道姓名）
学号 → 年龄（知道学号就知道年龄）
学号 → 系名（知道学号就知道系名）
系名 → 院长（知道系名就知道院长）

注意：系名 → 学号 ❌（一个系有很多学生）
```

## Armstrong 公理

| 规则 | 说明 |
|------|------|
| **自反律** | 如果 Y ⊆ X，则 X → Y |
| **增广律** | 如果 X → Y，则 XZ → YZ |
| **传递律** | 如果 X → Y 且 Y → Z，则 X → Z |

## 小结

| 概念 | 要点 |
|------|------|
| **函数依赖** | X → Y：X 决定 Y |
| **Armstrong 公理** | 推导所有依赖的完备规则集 |
| **候选键** | 能唯一确定所有属性的最小属性集 |

**为什么先学这个？** 函数依赖是[[normalization|范式（1NF ~ BCNF）]]的理论基础。
