---
id: sr-latch
title: SR 锁存器
summary: SR 锁存器（SR Latch）是用两个与非门交叉连接实现的最简单的存储单元
difficulty: intermediate
order: 6
parent: logic-gates
children:
  - d-flipflop
  - register
related: []
prerequisites:
  - logic-gates
tags:
  - hardware
  - logic-gates
createdAt: 2026-06-11
---

## 从组合逻辑到时序逻辑

前面的 [[logic-gates|逻辑门]] 和 [[half-adder|加法器]] 都属于**组合逻辑电路**——输出只取决于当前输入，**没有记忆能力**。

锁存器（Latch）是**时序逻辑电路**的起点——它可以**记住 1 位数据**（0 或 1），直到被新的信号改变。

## SR 锁存器电路

SR 锁存器由两个**与非门**交叉连接而成：

```mermaid
graph LR
    S[S] --> NAND_A[NAND A]
    R[R] --> NAND_B[NAND B]
    NAND_A --> Q[Q]
    NAND_B --> Q̅[Q̅]
    NAND_A -.->|反馈| NAND_B
    NAND_B -.->|反馈| NAND_A
```

- **S**（Set，置位）：使 Q = 1
- **R**（Reset，复位）：使 Q = 0
- **Q**：存储的值
- **Q̅**：Q 的取反（用于输出完整性）

## 状态表

| S | R | Q 的下一个状态 |
|---|---|--------------|
| 0 | 0 | 不允许（无效） |
| 0 | 1 | 1（置位）     |
| 1 | 0 | 0（复位）     |
| 1 | 1 | 保持不变     |

## 工作原理

1. **S=0, R=1**：与非门输出 1，Q 被置为 1（SET）
2. **S=1, R=0**：与非门输出 0，Q 被复位为 0（RESET）
3. **S=1, R=1**：锁存器保持当前状态不变（**存储**）
4. **S=0, R=0**：Q 和 Q̅ 同时为 1，破坏逻辑关系，不允许

## 从锁存器到寄存器

一个 SR 锁存器只能存储 1 位。将多个锁存器组合，可以构成：

- [[d-flipflop|D 触发器]]：增加时钟控制，解决输入约束问题
- [[register|寄存器]]：多个触发器并排，实现多位数存储
- **内存**：更大规模的存储阵列

## 小结

SR 锁存器是最简单的存储单元，它的双稳态特性是所有时序逻辑电路的基础。
