---
id: half-adder
title: 半加器
summary: 半加器是实现两个二进制位相加的基础组合逻辑电路
difficulty: intermediate
order: 4
parent: logic-gates
children: []
related:
  - full-adder
prerequisites:
  - and-gate
  - or-gate
tags:
  - hardware
  - arithmetic
createdAt: 2026-06-11
---

## 什么是半加器？

半加器（Half Adder）是数字电路中最基本的加法单元。它可以计算**两个二进制位相加**，产生一个**和（Sum）**与一个**进位（Carry）**。

## 真值表

| A | B | 和 (S) | 进位 (C) |
|---|---|--------|---------|
| 0 | 0 | 0      | 0       |
| 0 | 1 | 1      | 0       |
| 1 | 0 | 1      | 0       |
| 1 | 1 | 0      | 1       |

## 电路实现

半加器用两个逻辑门实现：

```
A ──╮
    ╰─[XOR]── S (和)
B ──╯
A ──╮
    ╰─[AND]── C (进位)
B ──╯
```

- **和（S）**：A XOR B（异或门）
- **进位（C）**：A AND B（与门）

## 局限性

半加器只能处理两个输入位的相加，**无法处理来自低位的进位**。要计算多位二进制加法，需要将多个半加器组合成 [[full-adder|全加器]]。

## 应用

半加器是所有加法器的基础，而加法器是 [[../../03-compilers/alu|ALU]]（算术逻辑单元）的核心部件。

## 小结

半加器用异或门和与门实现了一位二进制加法。虽然简单，但它是计算机中所有算术运算的起点。
