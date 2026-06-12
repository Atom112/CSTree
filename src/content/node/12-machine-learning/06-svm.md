---
id: svm
title: 支持向量机（SVM）
summary: SVM 找到把两类数据分开的"最大间隔超平面"——离超平面最近的样本（支持向量）决定分类边界。核技巧让 SVM 处理非线性可分数据
difficulty: advanced
order: 6
parent: decision-tree
children:
  - knn
related: []
prerequisites:
  - linear-regression
tags:
  - ml
  - svm
  - kernel
createdAt: 2026-06-12
---

## SVM 核心思想

```
最大化间隔 = 找到让两类样本离分界线最远的超平面

优化目标：min ||w||²
约束：yᵢ(w·xᵢ + b) ≥ 1 对所有 i
```

## 核技巧

把数据映射到高维空间——在高维中线性可分：

| 核函数 | 公式 | 作用 |
|:------:|:----:|:----:|
| **线性** | K(x,y)=x·y | 线性可分 |
| **多项式** | K(x,y)=(x·y+c)^d | 多项式边界 |
| **RBF** | K(x,y)=exp(-γ||x-y||²) | 任意形状 |

## 小结

| 优点 | 缺点 |
|:----:|:----:|
| 在高维空间表现好 | 大数据集训练慢 |
| 理论基础扎实 | 核函数选择难 |

**为什么先学这个？** 然后学习[[knn|k 近邻与朴素贝叶斯]]。
