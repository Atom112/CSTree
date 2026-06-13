---
id: clustering
title: 聚类（k-Means, DBSCAN）
summary: 聚类把数据分成几组——"物以类聚"。k-Means 指定组数迭代优化，DBSCAN 按密度聚类，自动发现任意形状的簇
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
updatedAt: 2026-06-13
---

## 🧩 没有标签——但能看出"哪些是一伙的"

前面的问题都有"标签"——垃圾邮件标记了"是/否"、房价标签了实际价格。这叫**监督学习**。

但如果数据**没有标签**——给你 1000 个用户的购买记录，没有说"哪些用户是一类"——你能自己找出群组吗？

**聚类（Clustering）** 就是**无监督学习**中最典型的任务——让数据自己"物以类聚"。

---

## 🎯 k-Means——最常用的聚类算法

**思路**：把数据分成 k 个组，每个组有一个"中心点"。

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3)  # 分成 3 组
kmeans.fit(X)                   # 自动找出 3 个中心
labels = kmeans.labels_         # 每个数据属于哪个组
centers = kmeans.cluster_centers_  # 3 个中心的位置
```

**算法步骤**：
```
1. 随机选 k 个点作为初始"中心"
2. 把每个数据点分配给最近的中心
3. 更新中心 = 每组所有点的平均位置
4. 重复 2-3 步直到中心不再变化
```

**选择 k**：用"肘部法则"——画 k vs 每个点到其中心距离的图，找"拐点"。

---

## 🏔️ DBSCAN——发现任意形状的簇

k-Means 假设簇是"球形"的，且所有簇大小相近——但现实数据不这样。

DBSCAN 按**密度**聚类——在"密集"的区域画簇，"稀疏"的区域视为噪声。

```
DBSCAN 的参数：
- eps：两个点距离多远算"邻居"
- min_samples：一个区域至少有多少点才算"密集"

优点：不需要指定 k、能发现任意形状的簇、能识别噪声点
缺点：对 eps 参数敏感
```

---

## 📝 小结

| 算法 | 是否需要 k | 簇形状 | 噪声处理 |
|:----:|:---------:|:------:|:--------:|
| **k-Means** | ✅ 要指定 | 球形 | ❌ 不能 |
| **DBSCAN** | ❌ 自动发现 | 任意形状 | ✅ 能识别噪声 |

**为什么先学这个？** 聚类是高维数据的探索方法。另一个重要的无监督方法——[[pca|主成分分析（PCA）]]——降维。
