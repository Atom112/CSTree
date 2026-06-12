---
id: clustering
title: 聚类（k-Means, DBSCAN）
summary: 聚类是无监督学习——把数据分成有意义的组。k-Means 基于距离中心点划分，DBSCAN 基于密度发现任意形状簇
difficulty: intermediate
order: 8
parent: knn
children:
  - pca
related: []
prerequisites:
  - knn
tags:
  - ml
  - clustering
  - unsupervised
createdAt: 2026-06-12
---

## k-Means

```
1. 随机选 k 个中心点
2. 每个点分配到最近的中心
3. 更新中心为簇内点的均值
4. 重复 2-3 直到收敛
```

## DBSCAN

```
基于密度——不需要指定簇数量：
- 核心点：邻域内至少有 minPts 个点
- 边界点：在核心点邻域内但不是核心
- 噪声点：不在任何核心点邻域内
```

## 小结

| 算法 | 优点 | 缺点 |
|:----:|:----:|:----:|
| **k-Means** | 简单快速 | 需指定 k，球形簇 |
| **DBSCAN** | 任意形状，不需 k | 密度不均时效果差 |

**为什么先学这个？** 聚类后，学习[[pca|主成分分析（PCA）]]。
