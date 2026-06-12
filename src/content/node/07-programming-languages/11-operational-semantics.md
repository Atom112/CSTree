---
id: operational-semantics
title: 操作语义（小步/大步）
summary: 操作语义（Operational Semantics）用"程序如何一步步执行"来定义语言的含义——小步语义一次一步，大步语义一次到最终结果
difficulty: advanced
order: 11
parent: programming-paradigms
children: []
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - semantics
createdAt: 2026-06-12
---

## 小步语义

定义程序一步步如何归约：

```
(1 + 2) * (3 + 4)
→ 3 * (3 + 4)     （第一步：1+2 → 3）
→ 3 * 7           （第二步：3+4 → 7）
→ 21              （第三步：3*7 → 21）
```

## 大步语义

定义表达式直接到最终值：

```
⟨1+2, σ⟩ ⇓ 3           （σ 是环境）
⟨3+4, σ⟩ ⇓ 7
⟨(1+2)*(3+4), σ⟩ ⇓ 21  （直接到结果）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **小步语义** | 一步步规约，描述执行过程 |
| **大步语义** | 从表达式直接到最终值 |
| **用途** | 形式化定义语言含义、证明程序性质 |

**为什么先学这个？** 操作语义后，学习 PL 实现的实践——[[garbage-collection|垃圾回收机制]]。
