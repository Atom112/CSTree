---
id: hoare-logic
title: 程序验证（Hoare Logic, 分离逻辑）
summary: Hoare Logic 用前置条件、程序、后置条件的三元组 {P} C {Q} 来推理程序的正确性。分离逻辑扩展了 Hoare Logic，能处理指针和堆操作
difficulty: advanced
order: 4
parent: theorem-proving
children: []
related: []
prerequisites:
  - propositional-logic
tags:
  - formal
  - verification
  - hoare
createdAt: 2026-06-12
---

## Hoare Triple

```
{P} C {Q}

P = 运行前的条件（前置条件）
C = 程序
Q = 运行后的条件（后置条件）

例子：
{x = 0} x := x + 1 {x = 1}
```

## 推理规则

```
赋值：{Q[E/x]} x := E {Q}
顺序：{P} C1 {R}, {R} C2 {Q} → {P} C1; C2 {Q}
条件：{P ∧ B} C1 {Q}, {P ∧ ¬B} C2 {Q} → {P} if B then C1 else C2 {Q}
循环：{I ∧ B} C {I} → {I} while B do C {I ∧ ¬B}（I 是不变式）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **Hoare Triple** | {P} C {Q}——正确性规范 |
| **循环不变式** | 每次循环开始都成立的断言 |
| **分离逻辑** | 处理堆内存和指针别名 |

**为什么先学这个？** 形式化方法板块完。至此全部"枝叶板块"创建完成！
