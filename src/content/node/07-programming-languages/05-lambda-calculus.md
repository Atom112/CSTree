---
id: lambda-calculus
title: Lambda 演算基础
summary: Lambda 演算（λ-calculus）是函数式编程的理论基础——只用三样东西（变量、抽象、应用）就能表达一切计算
difficulty: advanced
order: 5
parent: evaluation-strategies
children: []
related: []
prerequisites:
  - evaluation-strategies
tags:
  - pl
  - lambda
  - theory
createdAt: 2026-06-12
---

## Lambda 演算的三条规则

```
变量：x
抽象：λx. e    （定义函数，参数 x，体 e）
应用：e1 e2    （把 e2 传给 e1）

示例：
λx. x         = 恒等函数
λx. λy. x     = 只返回第一个参数（True）
λx. λy. y     = 只返回第二个参数（False）
λf. λx. f x   = 函数应用，相当于 apply
```

## 归约——Beta 归约

```
(λx. x) y → y（恒等函数应用到 y）
(λx. λy. x) a b → (λy. a) b → a（取第一个参数）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **变量/抽象/应用** | Lambda 演算的三个基本构造 |
| **β 归约** | 函数应用的规约规则 |
| **图灵完备** | Lambda 演算可以表达一切可计算函数 |

**为什么先学这个？** Lambda 演算[[algebraic-data-types|代数数据类型与模式匹配]]的理论基础。
