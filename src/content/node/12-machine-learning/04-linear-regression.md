---
id: linear-regression
title: 线性回归与逻辑回归
summary: 线性回归拟合连续值（房价预测），逻辑回归输出概率（分类）。梯度下降是训练它们的最基本优化算法
difficulty: intermediate
order: 4
parent: ai-overview
children:
  - decision-tree
related: []
prerequisites:
  - ai-overview
tags:
  - ml
  - regression
  - gradient-descent
createdAt: 2026-06-12
---

## 线性回归

```python
y = wx + b                  # 一维
y = w1x1 + w2x2 + ... + b   # 多维

# 损失函数（MSE）：
L = 1/n * Σ(y_pred - y_true)²

# 梯度下降：
w = w - α * ∂L/∂w          # α = 学习率
```

## 逻辑回归

```python
# 用 sigmoid 函数把线性输出映射到 (0,1)
P(y=1) = 1 / (1 + e^(-(wx + b)))
```

## 小结

| 模型 | 输出 | 应用 |
|:----:|:----:|:----:|
| **线性回归** | 连续值 | 预测、拟合 |
| **逻辑回归** | 概率 (0,1) | 二分类 |

**为什么先学这个？** 线性模型后，学习[[decision-tree|决策树与随机森林]]。
