---
id: knn
title: k 近邻与朴素贝叶斯
summary: KNN 直接拿训练数据做判断——新样本看 k 个最近邻居投票。朴素贝叶斯用概率论做分类——假设特征相互独立
difficulty: intermediate
order: 7
parent: svm
children:
  - clustering
related: []
prerequisites:
  - linear-regression
tags:
  - ml
  - knn
  - naive-bayes
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧑‍🤝‍🧑 "你的朋友决定了你是什么样的人"

新同学第一天来上课——你想知道他大概是什么类型的人。看谁和他走得近：如果他和学霸们一起吃饭、一起自习——那他大概率也是学霸。

这就是 **KNN（K-Nearest Neighbors，k 近邻）** 的核心思想：**新样本的类别 = 离它最近的 k 个训练样本的投票结果。**

```python
from sklearn.neighbors import KNeighborsClassifier

# k=3：看最近 3 个邻居
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)  # "记住"所有训练数据
pred = knn.predict(X_test) # 新样本→找最近 3 个→投票
```

**KNN 的特别之处**：它是"惰性学习"——训练阶段什么都不做（只记住数据），预测时才计算。

**k 值的选择**：k 太小 → 受噪声影响大（过拟合）；k 太大 → 边界太模糊（欠拟合）。通常用交叉验证选 k。

---

## 📊 朴素贝叶斯——用概率做判断

"这封邮件是垃圾邮件吗？"

朴素贝叶斯（Naive Bayes）用贝叶斯定理计算**概率**：

```python
# P(垃圾邮件 | 出现"中奖") = P(出现"中奖" | 垃圾邮件) × P(垃圾邮件) / P(出现"中奖")

# "朴素"的假设：所有特征相互独立
# 比如："中奖"和"点击这里"在垃圾邮件中同时出现——但不考虑它们之间的相关性
# 这个假设在现实中几乎不成立——但效果意外地好
```

**朴素贝叶斯的优势**：训练极快、需要的训练数据少、适合高维数据（文本分类）。即使用于垃圾邮件过滤的核心算法之一。

---

## 📝 小结

| 模型 | 思想 | 优点 | 缺点 |
|:----:|:----:|:----:|:----:|
| **KNN** | 看 k 个最近邻居 | 简单、无训练过程 | 预测慢（要算所有距离）|
| **朴素贝叶斯** | 概率计算 | 快、适合高维 | 特征独立假设太强 |

**为什么先学这个？** 这两种都是"非参数"方法。接下来看无监督学习——[[clustering|聚类（k-Means, DBSCAN）]]。
