---
id: subtyping
title: 子类型与变型（协变/逆变）
summary: 子类型（Subtyping）是类型之间的"is-a"关系——Cat 是 Animal 的子类型。变型（Variance）描述容器类型在子类型关系下的行为
difficulty: advanced
order: 10
parent: static-vs-dynamic
children: []
related: []
prerequisites:
  - static-vs-dynamic
tags:
  - pl
  - subtyping
  - variance
createdAt: 2026-06-12
---

## 里氏替换原则

如果 Cat 是 Animal 的子类型，那任何用 Animal 的地方都可以用 Cat 替换——这就是**里氏替换原则（Liskov Substitution Principle）**。

## 变型

| 变型 | 含义 | 例子 |
|:----:|------|------|
| **协变** | `List<Cat>` 是 `List<Animal>` 的子类型 | 只读容器 |
| **逆变** | `Function<Animal>` 是 `Function<Cat>` 的子类型 | 函数参数 |
| **不变** | `Box<Cat>` 和 `Box<Animal>` 无关 | 读写容器 |

## 小结

| 概念 | 要点 |
|:----:|------|
| **子类型** | is-a 关系 |
| **协变** | 泛型参数同方向 |
| **逆变** | 泛型参数反方向 |
| **不变** | 泛型参数严格匹配 |

**为什么先学这个？** 类型系统后，学习程序语义——[[operational-semantics|操作语义]]。
