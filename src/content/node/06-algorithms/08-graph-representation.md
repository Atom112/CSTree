---
id: graph-representation
title: 图的表示（邻接矩阵/表）
summary: 图（Graph）由顶点和边组成——邻接矩阵用二维数组存边，邻接表用链表存每个顶点的邻居，各有优劣
difficulty: intermediate
order: 8
parent: binary-tree
children:
  - dfs-bfs
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - graph
createdAt: 2026-06-12
---

## 邻接矩阵 vs 邻接表

```python
# 邻接矩阵——VxV 矩阵
graph = [
    [0, 1, 1, 0],  # 0→1, 0→2
    [1, 0, 0, 1],  # 1→0, 1→3
    [1, 0, 0, 1],  # 2→0, 2→3
    [0, 1, 1, 0],  # 3→1, 3→2
]

# 邻接表——每个顶点的邻居列表
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2],
}
```

## 对比

| 特性 | 邻接矩阵 | 邻接表 |
|:----:|:--------:|:------:|
| 内存 | O(V²) | O(V+E) |
| 查边(u,v) | O(1) | O(degree(u)) |
| 遍历所有邻居 | O(V) | O(degree(u)) |

> 💡 稠密图用矩阵，稀疏图用邻接表。

## 小结

| 概念 | 要点 |
|:----:|------|
| **有向图/无向图** | 边是否有方向 |
| **有权图/无权图** | 边是否带权重 |
| **邻接矩阵** | 稠密图适用，查边快 |
| **邻接表** | 稀疏图适用，省内存 |

**为什么先学这个？** 图表示法是图算法的基础。接下来学习[[dfs-bfs|DFS / BFS]]。
