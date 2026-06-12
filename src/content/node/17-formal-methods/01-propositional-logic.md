---
id: propositional-logic
title: 命题逻辑与谓词逻辑
summary: 命题逻辑研究命题之间的逻辑关系（与、或、非、蕴含）。谓词逻辑引入量词（∀ 所有、∃ 存在）和谓词，表达能力更强，是程序验证的理论基础
difficulty: advanced
order: 1
parent:
children:
  - model-checking
related: []
prerequisites: []
tags:
  - formal
  - logic
  - verification
createdAt: 2026-06-12
---

## 命题逻辑

```
P ∧ Q    →  P 与 Q 都为真
P ∨ Q    →  P 或 Q 为真
¬P       → 非 P
P → Q    → 如果 P 则 Q
```

## 谓词逻辑

```
∀x ∈ N, x > 0      → 所有自然数大于 0（假）
∃x ∈ N, x = 0      → 存在自然数等于 0（真）
∀x, ∃y, y > x      → 对所有 x 存在更大的 y（真）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **命题** | 真或假的陈述 |
| **谓词** | 带参数的命题 |
| **量词** | ∀ 和 ∃ |

**为什么先学这个？** 逻辑后，学习[[model-checking|模型检验（Model Checking）]]。
