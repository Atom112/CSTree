---
id: algebraic-data-types
title: 代数数据类型与模式匹配
summary: 代数数据类型（Algebraic Data Type, ADT）用"组合"的方式构造类型——积类型（Product）是 AND，和类型（Sum）是 OR。模式匹配（Pattern Matching）是解构 ADT 的优雅方式
difficulty: intermediate
order: 6
parent: higher-order-functions
children:
  - lazy-evaluation
related: []
prerequisites:
  - higher-order-functions
tags:
  - pl
  - types
  - pattern-matching
createdAt: 2026-06-12
---

## 积类型与和类型

```haskell
-- 积类型（Product）：多个字段同时存在
data Person = Person String Int  -- 姓名 AND 年龄

-- 和类型（Sum）：几个可能中的一种
data Shape = Circle Float
           | Rect Float Float  -- 圆 OR 矩形
           | Triangle Float Float Float
```

## 模式匹配

```haskell
area :: Shape -> Float
area (Circle r) = 3.14 * r * r
area (Rect w h) = w * h
area (Triangle a b c) = sqrt(s*(s-a)*(s-b)*(s-c))
    where s = (a+b+c)/2
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **积类型** | AND——多个字段（类似 struct） |
| **和类型** | OR——多个可能（类似 enum） |
| **模式匹配** | 按结构解构 ADT |

**为什么先学这个？** 理解 ADT 后，学习[[lazy-evaluation|惰性求值与无穷数据结构]]。
