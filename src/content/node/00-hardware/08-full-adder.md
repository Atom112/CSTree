---
id: full-adder
title: 全加器
summary: 全加器是处理三个二进制位（两个加数+进位输入）相加的完整加法电路
difficulty: intermediate
order: 5
parent: logic-gates
children: []
related: []
prerequisites:
  - half-adder
tags:
  - hardware
  - arithmetic
createdAt: 2026-06-11
---

## 什么是全加器？

全加器（Full Adder）比 [[half-adder|半加器]] 多了一个**进位输入（Cin）**，可以处理来自低位的进位。它是构成多位加法器的基本单元。

## 真值表

| A | B | Cin | 和 (S) | 进位 (Cout) |
|---|---|-----|--------|-------------|
| 0 | 0 | 0   | 0      | 0           |
| 0 | 0 | 1   | 1      | 0           |
| 0 | 1 | 0   | 1      | 0           |
| 0 | 1 | 1   | 0      | 1           |
| 1 | 0 | 0   | 1      | 0           |
| 1 | 0 | 1   | 0      | 1           |
| 1 | 1 | 0   | 0      | 1           |
| 1 | 1 | 1   | 1      | 1           |

## 电路实现

全加器可以用**两个半加器 + 一个或门**实现：

```mermaid
graph TD
    subgraph HA1[半加器 1]
        A[A] --> XOR1[XOR]
        B[B] --> XOR1
        A --> AND1[AND]
        B --> AND1
    end

    subgraph HA2[半加器 2]
        Cin[C<sub>in</sub>] --> XOR2[XOR]
        S1[中间和] --> XOR2
        Cin --> AND2[AND]
        S1 --> AND2
    end

    XOR1 --> S1
    XOR2 --> S[和 S]
    AND1 --> OR[或门 OR]
    AND2 --> OR
    OR --> Cout[进位 C<sub>out</sub>]
```

## 级联：多位加法器

将多个全加器串联，低位的进位输出接到高位的进位输入，就构成了 **N 位加法器**：

```mermaid
graph LR
    FA0[FA₀] --> S0[S₀]
    FA1[FA₁] --> S1[S₁]
    FA2[FA₂] --> S2[S₂]
    FA3[FA₃] --> S3[S₃]

    A0[A₀] --> FA0
    B0[B₀] --> FA0
    A1[A₁] --> FA1
    B1[B₁] --> FA1
    A2[A₂] --> FA2
    B2[B₂] --> FA2
    A3[A₃] --> FA3
    B3[B₃] --> FA3

    C0[0] --> FA0
    FA0 -->|进位| FA1
    FA1 -->|进位| FA2
    FA2 -->|进位| FA3
    FA3 --> Cout[C<sub>out</sub>]
```

例如，8 个全加器串联可以计算 8 位二进制加法（0~255）。

## 小结

全加器解决了带进位的二进制加法问题，是 CPU 中 ALU（算术逻辑单元）的核心组成部分。
