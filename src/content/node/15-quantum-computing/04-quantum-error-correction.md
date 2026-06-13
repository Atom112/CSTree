---
id: quantum-error-correction
title: 量子纠错
summary: 量子比特极易受环境噪声干扰——量子纠错用多个物理 qubit 编码一个逻辑 qubit，检测并纠正错误。表面码（Surface Code）是当前最主流的方案
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
  - surface-code
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🔇 量子比特太"脆弱"了

经典计算机的比特很可靠——如果有干扰导致"0 变 1"，有 ECC 内存可以纠错。

但量子比特面临三个大问题：

```
1. 量子退相干（Decoherence）：
   qubit 的叠加态只能保持微秒到毫秒级——然后自动坍缩

2. 环境噪声：
   微小的热扰动、电磁波就会改变 qubit 状态

3. 测量破坏：
   你无法"检查"qubit 的状态而不破坏它

没有纠错 → 无法运行需要大量操作的长算法（如 Shor 算法）
```

---

## 💡 思想：用多个物理 qubit 保护一个逻辑 qubit

**量子纠错（Quantum Error Correction, QEC）** 的核心思想：

> **不用一个"物理量子比特"来存储信息——用多个物理 qubit 编码成一个"逻辑量子比特"。即使部分物理 qubit 出错，逻辑 qubit 仍然正确。**

```
一个"逻辑 qubit" = 多个"物理 qubit"的编码组合

例如：[[7,1,3]] Steane 码
- 7 个物理 qubit 编码 1 个逻辑 qubit
- 可以纠正 1 个 qubit 的错误
- 需要 3 次测量来检测错误（不直接测量数据 qubit）

错误率降低：
物理 qubit 错误率 1% → 逻辑 qubit 错误率 < 0.001%（1000 倍改善）
但需要 7-1000 倍的物理 qubit 数量
```

---

## 🧩 表面码——当前最主流的方案

**表面码（Surface Code）** 是目前最受青睐的量子纠错方案（Google、IBM、Microsoft 都在用）。

```
表面码的二维结构：

┌───┬───┬───┬───┐
│ D │ Z │ D │ Z │  D = 数据 qubit（存信息）
├───┼───┼───┼───┤  Z = 测量 qubit（检测 Z 错误）
│ X │ D │ X │ D │  X = 测量 qubit（检测 X 错误）
├───┼───┼───┼───┤
│ D │ Z │ D │ Z │
├───┼───┼───┼───┤
│ X │ D │ X │ D │
└───┴───┴───┴───┘

关键：测量 qubit 只和相邻的数据 qubit 交互
不直接测量数据 qubit→ 不破坏信息
通过测量结果推断哪个数据 qubit 出了错
```

**表面码的优势**：
- 只需要和相邻 qubit 交互（几何局部性——适合芯片实现）
- 容错阈值高（物理 qubit 错误率 < 1% 即可工作）
- 可以通过增大编码规模（更多物理 qubit）降低逻辑错误率

```python
# 逻辑错误率和物理 qubit 数量的关系（表面码）
# 码距 d (distance) 越大 → 纠错能力越强
# 所需物理 qubit 数 ≈ 2d²

d = 3  → ~18 qubits → 纠正 1 个错误
d = 5  → ~50 qubits → 纠正 2 个错误
d = 7  → ~98 qubits → 纠正 3 个错误

# Shor 算法需要逻辑 qubit 错误率 < 10⁻¹⁵
# 可能需要 d = 30+ → ~1800 物理 qubit / 逻辑 qubit
# 这就是为什么实用量子计算机需要百万级别的物理 qubit
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **退相干** | qubit 的叠加态随时间自动丧失——最大敌人 |
| **量子纠错（QEC）** | 多个物理 qubit 保护一个逻辑 qubit |
| **表面码** | 二维网格结构——当前最主流纠错方案 |
| **码距（d）** | 码距越大 → 纠错越强 → 需要更多物理 qubit |
| **代价** | 1 个逻辑 qubit 需数百到数千物理 qubit |

**为什么先学这个？** 纠错是实用量子计算的必要条件。最后一个话题——[[quantum-hardware|量子硬件]]——这些 qubit 具体怎么造？
