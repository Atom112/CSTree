---
id: balanced-tree
title: 平衡树（AVL / 红黑树）
summary: 平衡树在插入/删除后通过旋转保持左右子树高度差在允许范围内——保证所有操作 O(log n)，不会退化为链表
difficulty: advanced
order: 7
parent: binary-search-tree
children: []
related: []
prerequisites:
  - binary-search-tree
tags:
  - algorithm
  - tree
  - balanced
createdAt: 2026-06-12
---

## AVL 树

AVL 树要求每个节点的左右子树高度差 ≤ 1：

| 旋转 | 场景 | 操作 |
|:----:|:----:|:----:|
| **右旋** | LL 不平衡 | 左子变父 |
| **左旋** | RR 不平衡 | 右子变父 |
| **左右旋** | LR 不平衡 | 先左旋再右旋 |
| **右左旋** | RL 不平衡 | 先右旋再左旋 |

## 红黑树

红黑树的规则（C++ STL map / Java TreeMap 使用）：
1. 每个节点是红色或黑色
2. 根是黑色
3. 叶子（NIL）是黑色
4. 红色节点的子节点必须是黑色
5. 从任意节点到叶子，经过的黑色节点数相同

> 💡 AVL 查询更快（更严格的平衡），红黑树插入/删除更快（更少的旋转）。

## 小结

| 树 | 平衡条件 | 应用 |
|:---:|:--------:|------|
| **AVL** | 高度差 ≤ 1 | 查询多、修改少的场景 |
| **红黑树** | 红黑规则 | 通用（C++ map, Java TreeMap） |

**为什么先学这个？** 树结构后，进入图——[[graph-representation|图的表示（邻接矩阵/表）]]。
