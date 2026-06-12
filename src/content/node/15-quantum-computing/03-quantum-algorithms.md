---
id: quantum-algorithms
title: 量子算法（Grover, Shor）
summary: Shor 算法能在多项式时间内分解大整数——威胁 RSA 加密。Grover 算法在未排序数据库中平方加速搜索。两者展示了量子计算超越经典计算的潜力
difficulty: advanced
order: 3
parent: entanglement-bell
children:
  - quantum-error-correction
related: []
prerequisites:
  - qubit-gates
tags:
  - quantum
  - algorithms
createdAt: 2026-06-12
---

## Shor 算法

```
分解 N = p × q（RSA 依赖大整数分解的困难性）

经典：亚指数时间（但实践中不可行）
Shor：多项式时间 O((log N)³)

威胁：2048 位 RSA 在足够大的量子计算机上可被破解
```

## Grover 算法

```
在 N 个无序项中搜索目标：

经典：O(N)
Grover：O(√N)

对 AES-128：从 O(2¹²⁸) 降到 O(2⁶⁴)
```

## 小结

| 算法 | 加速 | 影响 |
|:----:|:----:|:----:|
| **Shor** | 指数级 | 破解 RSA/ECC |
| **Grover** | 平方级 | 减弱对称加密强度 |

**为什么先学这个？** 算法后，学习[[quantum-error-correction|量子纠错]]。
