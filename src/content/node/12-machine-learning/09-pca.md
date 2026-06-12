---
id: pca
title: 主成分分析（PCA）
summary: PCA 把高维数据投影到方差最大的低维子空间——去掉冗余维度，保留最重要的结构。是降维和可视化的标准工具
difficulty: advanced
order: 9
parent: clustering
children:
  - neural-network
related: []
prerequisites:
  - clustering
tags:
  - ml
  - pca
  - dimensionality-reduction
createdAt: 2026-06-12
---

## PCA 步骤

```
1. 数据中心化（减去均值）
2. 计算协方差矩阵
3. 求协方差矩阵的特征值和特征向量
4. 选前 k 个最大特征值对应的特征向量
5. 数据投影到这些特征向量上
```

## 应用

| 场景 | 说明 |
|:----:|------|
| **降维** | 减少特征数，加速训练 |
| **可视化** | 高维→2D/3D 散点图 |
| **去噪** | 丢弃小方差维度 |

**为什么先学这个？** PCA 后，进入深度学习——[[neural-network|神经网络与反向传播]]。
