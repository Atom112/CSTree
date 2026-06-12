---
id: qubit-gates
title: 量子比特与量子门
summary: 量子比特（Qubit）不是 0 或 1——而是 0 和 1 的叠加态。量子门操作 qubit 的状态，是量子计算的"指令"
difficulty: advanced
order: 1
parent:
children:
  - entanglement-bell
related: []
prerequisites: []
tags:
  - quantum
  - qubit
  - gate
createdAt: 2026-06-12
---

## Qubit

经典比特：0 或 1
量子比特：α|0⟩ + β|1⟩，|α|² + |β|² = 1

测量 qubit → 以 |α|² 概率坍缩到 |0⟩

## 量子门

```
Hadamard (H):  |0⟩ → 1/√2 (|0⟩ + |1⟩)  创建叠加态
Pauli-X (NOT): |0⟩ ↔ |1⟩                量子非门
CNOT:         |00⟩ → |00⟩, |10⟩ → |11⟩ 受控非门
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **叠加态** | qubit 同时是 0 和 1 |
| **测量** | 叠加态坍缩到确定值 |
| **量子门** | 操作 qubit 状态的指令 |

**为什么先学这个？** 了解 qubit 后，学习[[entanglement-bell|量子纠缠与贝尔不等式]]。
