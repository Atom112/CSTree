---
id: quantum-error-correction
title: 量子纠错
summary: 量子比特极易受环境干扰（退相干），量子纠错用多个物理 qubit 编码一个逻辑 qubit——表面码是当前最有前景的方案，是构建容错量子计算机的关键
difficulty: advanced
order: 4
parent: quantum-algorithms
children:
  - quantum-hardware
related: []
prerequisites:
  - qubit-gates
tags:
  - quantum
  - error-correction
createdAt: 2026-06-12
---

## 量子纠错挑战

```
经典纠错：直接复制比特 → 110 → 投票修正
量子纠错：不能复制 qubit（不可克隆定理）

解决方案：用量子纠错码把信息分布到多个 qubit 中
```

## 表面码（Surface Code）

```
用 2D 网格的物理 qubit 编码逻辑 qubit
- 数据 qubit 存储信息
- 测量 qubit 检测错误而不破坏数据
- 错误率低于阈值 → 增加物理 qubit 可降低逻辑错误率
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **退相干** | qubit 量子态随环境干扰丢失 |
| **表面码** | 2D 网格纠错，最实用方案 |
| **阈值** | 物理错误率 < 1% → 纠错有效 |

**为什么先学这个？** 纠错后，学习[[quantum-hardware|量子硬件概述]]。
