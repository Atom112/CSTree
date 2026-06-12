---
id: d-flipflop
title: D触发器
summary: D触发器是带时钟控制的1位存储单元，只在时钟边沿采样输入
difficulty: intermediate
order: 7
parent: logic-gates
children: []
related: []
prerequisites:
  - sr-latch
tags:
  - hardware
  - memory
createdAt: 2026-06-11
---

## 从锁存器到触发器

[[sr-latch|SR 锁存器]] 虽然能存储数据，但有两个缺点：

1. S 和 R 不能同时为 0（无效状态）
2. 输入变化时立即输出——无法**同步控制**何时翻转

**D 触发器（D Flip-Flop）** 解决了这两个问题。

## D 触发器的结构

D 触发器在 SR 锁存器基础上增加：

- **一个非门**：确保 S 和 R 不会同时为 0
- **时钟信号（CLK）**：控制何时采样输入

```mermaid
graph LR
    D[D] --> N1[NAND A]
    CLK[CLK] --> N1
    CLK --> NOT[非门 NOT]
    NOT --> N2[NAND B]
    CLK --> N2

    subgraph SR[SR 锁存器]
        NAND_C[NAND C] --> Q[Q]
        NAND_D[NAND D] --> Q̅[Q̅]
        NAND_C -.-> NAND_D
        NAND_D -.-> NAND_C
    end

    N1 --> NAND_C
    N2 --> NAND_D
```

## 功能表

| CLK | D | Q 的下一个状态 |
|-----|---|--------------|
| ↓   | X | 保持不变     |
| ↑   | 0 | 0（复位）    |
| ↑   | 1 | 1（置位）    |

> ↑ = 上升沿，↓ = 下降沿，X = 任意值

只有在**时钟上升沿**的瞬间，D 触发器的输出 Q 才变成 D 的值。其他时间 Q 保持不变。

## 为什么需要时钟？

时钟信号让所有触发器**同步工作**。就像阅兵方阵中所有人按同一个鼓点迈步一样，CPU 中成亿的触发器都跟着同一个时钟信号翻转。

这就是 **同步时序电路** 的核心思想。

## 应用

- **寄存器**：多个 D 触发器并排存储多位数据
- **计数器**：触发器级联实现二进制计数
- **状态机**：用触发器保存当前状态
- **分频器**：每个触发器将时钟频率减半

## 小结

D 触发器用时钟控制了"什么时候存储"，是现代数字电路中最基本的时序单元。多个 D 触发器组合起来就是 [[register|寄存器]]。
