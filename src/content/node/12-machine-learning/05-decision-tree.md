---
id: decision-tree
title: 决策树与随机森林
summary: 决策树按特征分裂数据——每个分支一次判断。随机森林是多个决策树的集成，比单棵树更稳定、不易过拟合
difficulty: intermediate
order: 5
parent: linear-regression
children:
  - svm
related: []
prerequisites:
  - linear-regression
tags:
  - ml
  - tree
  - ensemble
createdAt: 2026-06-12
---

## 决策树分裂

```
信息增益 = 父节点不纯度 - Σ(子节点比例 × 子节点不纯度)

不纯度度量：
- 基尼系数：1 - Σ(pᵢ²)
- 信息熵：-Σ(pᵢ log pᵢ)
- 分类误差：1 - max(pᵢ)
```

## 随机森林

```
1. 从训练集中有放回抽样 N 份（Bootstrap）
2. 每份样本训练一棵决策树
3. 每棵树分裂时只随机选部分特征
4. 预测时多数投票（分类）或平均（回归）
```

## 小结

| 模型 | 优点 | 缺点 |
|:----:|:----:|:----:|
| **决策树** | 可解释性强 | 易过拟合 |
| **随机森林** | 稳定、抗过拟合 | 模型大、解释性差 |

**为什么先学这个？** 树模型后，学习[[svm|支持向量机（SVM）]]。
