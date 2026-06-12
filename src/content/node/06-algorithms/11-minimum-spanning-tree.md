---
id: minimum-spanning-tree
title: 最小生成树（Kruskal, Prim）
summary: 最小生成树（MST）是连通无向图中边权和最小的生成树——Kruskal 排序选边（并查集），Prim 从点出发扩展（类似 Dijkstra）
difficulty: advanced
order: 11
parent: dfs-bfs
children: []
related: []
prerequisites:
  - dfs-bfs
tags:
  - algorithm
  - graph
  - mst
createdAt: 2026-06-12
---

## Kruskal 算法

```python
def kruskal(edges, n):
    # 按权重排序，从小到大选，不形成环（用并查集检查）
    edges.sort(key=lambda e: e[2])  # (u, v, weight)
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    mst = []
    for u, v, w in edges:
        if find(u) != find(v):
            parent[find(u)] = find(v)
            mst.append((u, v, w))
    return mst
```

## Prim 算法

类似 Dijkstra——从起点出发，每次选最小权边连接未访问的点。

## 小结

| 算法 | 核心 | 复杂度 |
|:----:|:----:|:------:|
| **Kruskal** | 排序+并查集 | O(E log E) |
| **Prim** | 优先队列 | O(E log V) |

**为什么先学这个？** 图算法结束后，复习排序——[[basic-sort|基础排序（插入、选择、冒泡）]]。
