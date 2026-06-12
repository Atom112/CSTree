---
id: theorem-proving
title: 定理证明（Coq, Lean）
summary: 定理证明器把数学证明写成代码——计算机检查每一步逻辑推导是否严格正确。Curry-Howard 同构揭示"证明即程序，命题即类型"
difficulty: advanced
order: 3
parent: model-checking
children:
  - hoare-logic
related: []
prerequisites:
  - propositional-logic
tags:
  - formal
  - theorem-proving
  - coq
createdAt: 2026-06-12
---

## Curry-Howard 同构

```
命题 = 类型
证明 = 程序
蕴含 = 函数类型
合取 = 积类型
析取 = 和类型
```

## 交互式定理证明

```coq
(* Coq 示例：证明 1+1 = 2 *)
Theorem one_plus_one : 1 + 1 = 2.
Proof.
  simpl.    (* 计算 1+1 得到 2 *)
  reflexivity.  (* 2=2 显然成立 *)
Qed.
```

## 小结

| 工具 | 特点 | 应用 |
|:----:|:----:|:----:|
| **Coq** | 历史悠久，大量教材 | CompCert 编译器验证 |
| **Lean** | 现代设计，数学库 | 数学定理形式化 |
| **Isabelle** | 自动程度高 | 操作系统验证（seL4） |

**为什么先学这个？** 定理证明后，学习[[hoare-logic|程序验证（Hoare Logic）]]。
