---
id: knn
title: k 近邻与朴素贝叶斯
summary: k-NN 用"投票"分类——看离待分类样本最近的 k 个邻居。朴素贝叶斯基于贝叶斯定理，"朴素"在假设所有特征独立
difficulty: intermediate
order: 7
parent: svm
children:
  - clustering
related: []
prerequisites:
  - svm
tags:
  - ml
  - knn
  - naive-bayes
createdAt: 2026-06-12
---

## k-NN

```python
def knn_predict(train_X, train_y, test_x, k=3):
    distances = [dist(test_x, x) for x in train_X]
    nearest = np.argsort(distances)[:k]
    return majority_vote(train_y[nearest])
```

## 朴素贝叶斯

```
P(类别|特征) = P(特征|类别) × P(类别) / P(特征)
朴素假设：特征之间相互独立
→ P(特征|类别) = P(特征₁|类别) × P(特征₂|类别) × ...
```

## 小结

| 模型 | 原理 | 适用 |
|:----:|:----:|:----:|
| **k-NN** | 找最近邻居投票 | 低维小数据 |
| **朴素贝叶斯** | 贝叶斯定理+独立假设 | 文本分类、垃圾过滤 |

**为什么先学这个？** 监督学习后，进入无监督——[[clustering|聚类（k-Means, DBSCAN）]]。
