---
id: neural-network
title: 神经网络与反向传播
summary: 神经网络（MLP）是多层感知器的堆叠——每层是线性变换+非线性激活函数。反向传播通过链式法则计算梯度，是训练神经网络的核心算法
difficulty: advanced
order: 10
parent: pca
children:
  - cnn
related: []
prerequisites:
  - linear-regression
tags:
  - dl
  - neural-network
  - backprop
createdAt: 2026-06-12
---

## 感知器

```
输入 → 加权和 → 激活函数 → 输出

y = σ(w·x + b)

σ 可以是 sigmoid、ReLU、tanh 等
```

## 反向传播

```
前向传播：计算每层输出和最终损失
反向传播：从输出层往回计算每层的梯度（链式法则）
参数更新：梯度下降更新 w 和 b
```

## 小结

| 激活函数 | 公式 | 特点 |
|:--------:|:----:|:----:|
| **Sigmoid** | 1/(1+ℯ⁻ˣ) | 输出 (0,1)，梯度饱和 |
| **ReLU** | max(0,x) | 简单，无梯度消失 |
| **Tanh** | (ℯˣ-ℯ⁻ˣ)/(ℯˣ+ℯ⁻ˣ) | 输出 (-1,1) |

**为什么先学这个？** 基础网络后，学习[[cnn|卷积神经网络（CNN）]]。
