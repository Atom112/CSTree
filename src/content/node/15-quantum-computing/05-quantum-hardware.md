---
id: quantum-hardware
title: 量子硬件概述
summary: 量子计算机的物理实现有多种方案——超导 qubit（Google/IBM）工作在极低温，离子阱（IonQ）用电磁场囚禁离子。目前最高约 1000+ qubit，但纠错后逻辑 qubit 远少于物理 qubit
difficulty: advanced
order: 5
parent: quantum-error-correction
children: []
related: []
prerequisites:
  - qubit-gates
tags:
  - quantum
  - hardware
createdAt: 2026-06-12
---

## 物理实现方案

| 方案 | 代表 | 温度 | 特点 |
|:----:|:----:|:----:|:----:|
| **超导** | Google, IBM, 中科大 | 15mK | 工艺成熟，门速度快 |
| **离子阱** | IonQ, Honeywell | 室温 | 保真度高，操作慢 |
| **光量子** | 潘建伟团队 | 室温 | 光子之间难纠缠 |
| **拓扑** | Microsoft | 极低温 | 理论抗噪声，尚未实现 |

## 量子体积

IBM 提出的综合性能指标——衡量量子计算机的真实能力，不仅看 qubit 数量。2024 年 IBM 达到量子体积 512。

## 小结

| 概念 | 要点 |
|:----:|------|
| **退相干时间** | qubit 保持量子态的时间 |
| **门保真度** | 量子门操作的精度 |
| **量子体积** | 综合性能指标 |

**为什么先学这个？** 量子计算板块完。进入区块链板块。
