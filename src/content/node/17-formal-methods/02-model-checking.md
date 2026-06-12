---
id: model-checking
title: 模型检验（Model Checking）
summary: 模型检验自动验证系统是否满足给定规范——把系统建模为状态机，用时序逻辑（LTL/CTL）描述规范，穷举搜索所有状态检查是否违反规范
difficulty: advanced
order: 2
parent: propositional-logic
children:
  - theorem-proving
related: []
prerequisites:
  - propositional-logic
tags:
  - formal
  - model-checking
  - verification
createdAt: 2026-06-12
---

## 模型检验流程

```
系统 → 建模（状态机）
规范 → 时序逻辑公式（LTL/CTL）
工具 → 穷举搜索所有状态
结果 → 通过 / 违反（提供反例）
```

## 时序逻辑

```
G p      → 全局成立（Always p）
F p      → 最终成立（Eventually p）  
X p      → 下一步成立（Next p）
p U q    → p 成立直到 q 成立（p Until q）
```

## 小结

| 工具 | 用途 |
|:----:|------|
| **TLA+** | 系统设计规范（Amazon 使用） |
| **NuSMV** | 符号模型检验 |
| **SPIN** | Promela 语言模型检验 |

**为什么先学这个？** 模型检验后，学习[[theorem-proving|定理证明（Coq, Lean）]]。
