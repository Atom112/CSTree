---
id: multiplexer
title: 多路选择器
summary: 多路选择器（Multiplexer / MUX）根据选择信号从多路输入中选出一路输出，是数据通路的"开关"
difficulty: intermediate
order: 13
parent: logic-gates
children: []
related:
  - alu
  - decoder-encoder
prerequisites:
  - and-gate
  - or-gate
  - not-gate
tags:
  - hardware
createdAt: 2026-06-12
---

## 什么是多路选择器？

**多路选择器（Multiplexer，简称 MUX）** 根据选择信号从多个输入中选出**一个**输出。可以用一个开关来理解：

```
输入 0 ─╮
        ├──●── 输出（旋转开关选择哪一路输入接通）
输入 1 ─╯
```

对于数字电路，MUX 用组合逻辑实现——不需要机械开关。

## 2-to-1 MUX

最简单的 MUX：2 路输入，1 位选择信号 S。

| S | 输出 |
|---|------|
| 0 | Y = A |
| 1 | Y = B |

**逻辑表达式**：$Y = \overline{S} \cdot A + S \cdot B$

```mermaid
graph LR
    A[A 输入] --> AND1[与门 1]
    S[S 选择] --> NOT[非门]
    NOT --> AND1
    S --> AND2[与门 2]
    B[B 输入] --> AND2
    AND1 --> OR[或门]
    AND2 --> OR
    OR --> Y[Y 输出]
```

## 4-to-1 MUX

4 路输入，2 位选择信号 S₁S₀。

| S₁ | S₀ | 输出 |
|----|----|------|
| 0  | 0  | Y = A |
| 0  | 1  | Y = B |
| 1  | 0  | Y = C |
| 1  | 1  | Y = D |

**逻辑表达式**：$Y = \overline{S_1}\overline{S_0}A + \overline{S_1}S_0B + S_1\overline{S_0}C + S_1S_0D$

```mermaid
graph TD
    A[A] --> AND0[与门 0]
    B[B] --> AND1[与门 1]
    C[C] --> AND2[与门 2]
    D[D] --> AND3[与门 3]

    S0[S₀] --> NOT0[非门 0]
    S0[  ] --> NOT1[非门 1]
    S1[S₁] --> NOT2[非门 2]
    S1[  ] --> NOT3[非门 3]

    NOT0 --> AND0
    NOT2 --> AND0
    S0 --> AND1
    NOT2 --> AND1
    NOT0 --> AND2
    S1 --> AND2
    S0 --> AND3
    S1 --> AND3

    AND0 --> OR[或门]
    AND1 --> OR
    AND2 --> OR
    AND3 --> OR
    OR --> Y[Y 输出]
```

## MUX 的级联扩展

用 2-to-1 MUX 可以构建任意规模的 MUX。例如，4-to-1 MUX 可以用 3 个 2-to-1 MUX 构建：

```mermaid
graph LR
    A[A] --> MUX1[2-to-1<br>S₀ 选择]
    B[B] --> MUX1
    C[C] --> MUX2[2-to-1<br>S₀ 选择]
    D[D] --> MUX2

    MUX1 --> MUX3[2-to-1<br>S₁ 选择]
    MUX2 --> MUX3
    MUX3 --> Y[Y 输出]
```

## 应用：ALU 中的 MUX

在 [[alu|ALU]] 中，MUX 用于选择输出哪种运算结果：

```
加法器结果 ──╮
减法器结果 ──╠══  MUX  ══▶  ALU 输出
与运算结果 ──╣
或运算结果 ──╯
               ▲
               选择信号 OP₀ OP₁
```

ALU 操作选择可以看作一个 4-to-1 MUX：
- OP = 00 → 输出加法结果
- OP = 01 → 输出减法结果
- OP = 10 → 输出按位与
- OP = 11 → 输出按位或

## 实际应用

| 应用 | 说明 |
|------|------|
| 寄存器选择 | CPU 中多个寄存器共享一条数据总线，MUX 选择当前读哪个寄存器 |
| 数据通路 | 选择将 ALU 结果、内存数据或立即数写入寄存器 |
| 指令译码 | 不同指令使用 CPU 中不同的功能单元，MUX 路由数据 |
| 时分复用 | 通信系统中多路信号共享一条传输线路 |
| 函数发生器 | 用 MUX 实现任意组合逻辑（MUX 本质上是通用逻辑块） |

## MUX 与译码器的关系

[[decoder-encoder|译码器]] 和 MUX 都使用与门阵列结构，但功能相反：

- **译码器**：地址输入 → 选通一条输出（1-to-N 分配）
- **MUX**：选择信号 → 从多路输入中选一路输出（N-to-1 汇集）

两者配合可以实现数据选择、分配和路由的全部功能。

## 小结

多路选择器是数据通路的"闸门"——它决定了哪条数据线可以通行。从 ALU 操作选择到寄存器堆读取，MUX 是 CPU 中最常用的基本部件之一。其核心结构（与门 + 或门）体现了"与或式"组合逻辑的通用性。
