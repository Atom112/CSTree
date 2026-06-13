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
updatedAt: 2026-06-13
---

## 📈 房价和面积——一条直线的关系

你搜集了一些房子的数据：面积 50m² → 总价 100 万、80m² → 160 万、100m² → 190 万……

如果有套 75m² 的房子——你估计值多少钱？

线性回归（Linear Regression）解决的就是这种问题：**找到一条直线，尽可能拟合所有数据点。**

```python
# 一维线性回归
y = wx + b
# y=房价, x=面积, w=斜率(每平米单价), b=截距(底价)

# 多维线性回归
y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
```

**梯度下降（Gradient Descent）**——找最优 w 和 b 的方法：

```python
# 1. 定义损失函数（MSE：均方误差）
# 衡量"当前直线和数据的差距"
loss = (1/n) * Σ(y_pred - y_true)²

# 2. 计算梯度（对 w 和 b 求偏导）
# 梯度指向"loss 增加最快的方向"

# 3. 沿负梯度方向更新参数
w = w - learning_rate * gradient_w
b = b - learning_rate * gradient_b

# 重复 2-3 步，直到 loss 不再下降
```

**学习率（learning rate）** 决定每一步走多远——太大会跳过最优点，太小收敛太慢。

---

## 🚦 逻辑回归——输出"概率"而不是"数值"

线性回归预测"数值"——但很多问题是"分类"：这封邮件是垃圾邮件吗？这张图片里有猫吗？

逻辑回归把线性输出通过 **Sigmoid 函数** 映射到 (0,1) 之间的概率：

```python
# 线性模型：z = wx + b            （z 可以是任何实数）
# Sigmoid：P = 1 / (1 + e^(-z))    （把 z 压缩到 0~1）

# P > 0.5 → 预测为类别 1（如"是垃圾邮件"）
# P < 0.5 → 预测为类别 0（如"不是垃圾邮件"）
```

---

## 📝 小结

| 模型 | 输出 | 损失函数 | 应用场景 |
|:----:|:----:|:--------:|---------|
| **线性回归** | 连续值 | MSE | 房价预测、温度预测 |
| **逻辑回归** | 概率 (0,1) | 交叉熵 | 二分类（垃圾邮件、疾病诊断）|

**为什么先学这个？** 线性模型是最基本的机器学习模型。下一步看[[decision-tree|决策树与随机森林]]——另一种完全不同的建模方式。
