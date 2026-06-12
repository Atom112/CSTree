---
id: shortest-path
title: 最短路径（Dijkstra, Floyd）
summary: Dijkstra 算法从单源点出发找最短路径——贪心思想，每次选当前最近的点扩展。Floyd 算法用动态规划求所有点对的最短路径
difficulty: advanced
order: 10
parent: dfs-bfs
children: []
related: []
prerequisites:
  - dfs-bfs
tags:
  - algorithm
  - graph
  - shortest-path
createdAt: 2026-06-12
---

## Dijkstra——单源最短路径

```python
import heapq
def dijkstra(graph, start):
    dist = {v: float('inf') for v in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, v = heapq.heappop(pq)
        if d > dist[v]: continue
        for w, weight in graph[v]:
            nd = d + weight
            if nd < dist[w]:
                dist[w] = nd
                heapq.heappush(pq, (nd, w))
    return dist
```

> 🏫 **类比：导航路线规划**——你从北京到上海，地图软件找出一条最短的路线。每次从"已确定最短路径"的城市扩展到邻接城市。

## Floyd——所有点对最短路径

```python
# 三维动态规划：dp[k][i][j] = 经过前 k 个点，i→j 的最短路径
for k in range(n):
    for i in range(n):
        for j in range(n):
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

## 小结

| 算法 | 复杂度 | 适用 |
|:----:|:------:|------|
| **Dijkstra** | O((V+E)log V) | 非负权图 |
| **Floyd** | O(V³) | 小图，所有点对 |

**为什么先学这个？** 最短路径后，继续学习[[minimum-spanning-tree|最小生成树（Kruskal, Prim）]]。
