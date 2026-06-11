---
id: boolean-algebra
title: 布尔代数
summary: 布尔代数是数字电路的理论基础，使用逻辑运算处理真（1）和假（0）值
difficulty: beginner
order: 2
parent: binary-numbers
children: []
related: []
prerequisites:
  - binary-numbers
tags:
  - math
  - hardware
createdAt: 2026-06-11
---

## 什么是布尔代数？

布尔代数（Boolean Algebra）是 [[binary-numbers|二进制]] 的逻辑基础。它由乔治·布尔在19世纪提出，使用 **与（AND）**、**或（OR）**、**非（NOT）** 三种基本运算处理真（1）和假（0）值。

## 三种基本运算

### 与运算（AND）

两个输入都为 1 时，输出 1；否则输出 0。

| A | B | A AND B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

### 或运算（OR）

两个输入中至少有一个为 1 时，输出 1。

| A | B | A OR B |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

### 非运算（NOT）

取反操作。

| A | NOT A |
|---|-------|
| 0 | 1 |
| 1 | 0 |

## 布尔代数定律

- **交换律**：A AND B = B AND A
- **结合律**：(A AND B) AND C = A AND (B AND C)
- **分配律**：A AND (B OR C) = (A AND B) OR (A AND C)
- **德摩根定律**：NOT (A AND B) = (NOT A) OR (NOT B)

## 小结

布尔代数是一切数字电路的理论基础。在下一节中，我们将学习如何用物理电路实现这些逻辑运算——[[logic-gates|逻辑门]]。
