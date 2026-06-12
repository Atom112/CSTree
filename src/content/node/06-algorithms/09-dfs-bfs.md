---
id: dfs-bfs
title: DFS / BFS
summary: DFS（深度优先搜索）用栈/递归深入到底再回溯，BFS（广度优先搜索）用队列逐层扩散——是最基本的两种图/树搜索算法
difficulty: intermediate
order: 9
parent: graph-representation
children:
  - shortest-path
  - minimum-spanning-tree
related: []
prerequisites:
  - stack-queue
  - graph-representation
tags:
  - algorithm
  - dfs
  - bfs
  - graph
createdAt: 2026-06-12
---

## BFS——队列，逐层

```python
from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        v = queue.popleft()
        for neighbor in graph[v]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

> 🏫 **类比：波浪扩散**——石子投入水中，波纹一圈圈向外扩散。

## DFS——栈/递归，深入

```python
def dfs(graph, v, visited=None):
    if visited is None:
        visited = set()
    visited.add(v)
    for neighbor in graph[v]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

> 🏫 **类比：走迷宫**——一直往前走，走到死胡同就退回上一个岔路口换条路。

## 小结

| 算法 | 数据结构 | 空间 | 应用 |
|:----:|:--------:|:----:|------|
| **BFS** | 队列 | O(宽度) | 最短路径、层次遍历 |
| **DFS** | 栈/递归 | O(深度) | 拓扑排序、连通性检测 |

**为什么先学这个？** BFS 是[[shortest-path|最短路径（Dijkstra）]]的基础。
