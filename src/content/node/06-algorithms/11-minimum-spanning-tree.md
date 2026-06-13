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
updatedAt: 2026-06-13
---

## 🏗️ 给 7 个城市铺光缆——最少需要多少公里？

假设你的公司要在 7 个城市之间铺设光缆。任意两个城市之间都可以铺设，但成本（距离）不同。你想让所有城市都连通（任意两个城市之间都能通过光缆通信），同时**总成本最低**。

你应该怎么铺？

这个问题就是 **最小生成树（Minimum Spanning Tree, MST）** 问题：在一个带权无向连通图中，找一个**包含所有顶点的树**，且**所有边的权重之和最小**。

```
城市网络（数字是公里数）：
   北京
  / | \
1   |5  2
/   |   \
天津─4─上海
 \  |  /
  3 |6
   \| /
   广州

最小生成树（总长度=1+2+3+4=10）：
   北京
   |
   1
   |
   天津
   / \
  3   4
 /     \
广州    上海
```

> 🧭 **类比：一个镇子要通自来水**
>
> 镇长决定让全镇 10 个村子都通上自来水。主管道是从水厂铺出去的，但不用每个村子都直接从水厂拉管子——你可以在村子之间铺设支管，只要所有村子都连成一张"管道网"就行。
>
> 目标：**总管道长度最短**，同时每个村子都能用上水。
>
> 这就是一个 MST 问题——你不需要回路（多了就是浪费），只需要足够让所有点连通的边。

---

## 🌲 什么是一棵"生成树"？

**生成树（Spanning Tree）** = 包含图中**所有顶点**，且**边数 = V-1** 的树。一个连通图可以有多个不同的生成树。

**最小生成树（Minimum Spanning Tree, MST）** = 所有生成树中，**边权和最小**的那个。

```
连通图有 4 个顶点：
A ─5─ B
|  \  |
3    2  4
|     \ |
C ─6─ D

可能的生成树：
A─5─B     A─5─B     A─5─B
|         |   4    3    4
3         |   |    |    |
C         C   D    C    D
总长=8    总长=9   总长=12
                     ↑ 最小的是 8
```

---

## ✂️ Kruskal 算法——排序选边

### 核心思想

**从短到长选边，不形成环就保留。**

### 算法步骤

1. 把所有边按权重从小到大排序
2. 从最小权重边开始，如果加入这条边**不会形成环**，就选入 MST
3. 重复直到选了 V-1 条边

### 过程演示

```
图：
A ─5─ B     边：(A,B,5), (A,C,3), (B,D,4), (C,D,6), (A,D,2)
|  \  |        排序：(A,D,2), (A,C,3), (B,D,4), (A,B,5), (C,D,6)
3    2  4
|     \ |
C ─6─ D

选边过程：
① 选 (A,D,2) → 不形成环 ✅  MST: A-D
② 选 (A,C,3) → 和 A-D 不形成环 ✅  MST: A-D, A-C
③ 选 (B,D,4) → 和 A-D 不形成环 ✅  MST: A-D, A-C, B-D
④ 选 (A,B,5) → A-B-D 会形成环 ❌ 跳过
⑤ 选 (C,D,6) → A-C-D 会形成环 ❌ 跳过

选了 3 条边 = V-1 = 3，停止。
MST: A-D(2), A-C(3), B-D(4) 总长=9
```

### 代码实现

Kruskal 需要能快速判断"加入一条边会不会形成环"——这用 **并查集（Union-Find）** 实现：

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 路径压缩
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px != py:
            self.parent[px] = py
            return True  # 合并成功
        return False  # 已经在同一集合中（会形成环）

def kruskal(edges, n):
    """
    edges: [(u, v, weight), ...]
    n: 顶点数
    返回: MST 的边列表
    """
    edges.sort(key=lambda e: e[2])  # 按权重排序
    uf = UnionFind(n)
    mst = []
    
    for u, v, w in edges:
        if uf.union(u, v):  # 不会形成环
            mst.append((u, v, w))
            if len(mst) == n - 1:
                break
    
    return mst
```

### 复杂度

- 排序：O(E log E)
- 并查集操作：O(E α(V))（α 是阿克曼函数的反函数，近似常数）
- **总体：O(E log E)**

---

## 🌱 Prim 算法——从点出发扩展

### 核心思想

从任意一个顶点开始，每次选择**连接"已在树中"和"不在树中"的最小权重边**，把新顶点加入树。

### 和 Dijkstra 的对比

Prim 和 Dijkstra 非常像——唯一区别是 Prim 的"距离"是**到 MST 的距离**，不是到源点的距离：

```python
# Dijkstra 更新的是到源点的距离：
new_dist = dist[current] + weight

# Prim 更新的是到 MST 的距离：
new_dist = weight  # 只看边的权重，不累加
```

### 代码实现

```python
import heapq

def prim(graph, start=0):
    """
    graph: 邻接表 {v: [(neighbor, weight), ...]}
    返回: MST 的总权重
    """
    n = len(graph)
    visited = [False] * n
    # (权重, 顶点) — 最小堆
    pq = [(0, start)]
    total_weight = 0
    
    while pq:
        w, v = heapq.heappop(pq)
        if visited[v]:
            continue
        visited[v] = True
        total_weight += w
        
        for neighbor, weight in graph[v]:
            if not visited[neighbor]:
                heapq.heappush(pq, (weight, neighbor))
    
    return total_weight
```

### 复杂度

- 用优先队列：O(E log V)
- 用简单数组（密集图）：O(V²)

---

## ⚔️ Kruskal vs Prim

| 维度 | Kruskal | Prim |
|:----:|:--------:|:----:|
| **核心操作** | 选边 | 选点 |
| **数据结构** | 并查集 | 优先队列 |
| **适用图** | 稀疏图（边少）| 稠密图（边多）|
| **复杂度** | O(E log E) | O(E log V) |
| **实现难度** | 中等 | 简单（类似 Dijkstra）|

**选择原则**：

```python
# 稀疏图（E ≈ V） → Kruskal
# 比如：V=10000, E=15000
# Kruskal: 15000 log 15000 ≈ 15000 × 14 = 210k

# 稠密图（E ≈ V²） → Prim
# 比如：V=1000, E=500000
# Prim: 500000 log 1000 ≈ 500000 × 10 = 5M （但可以用 O(V²) 实现）
```

---

## 🔍 验证 MST 的正确性

切分性质（Cut Property）是 MST 的理论基础：

> 在图中任意切一刀，把顶点分成两个集合。连接两个集合的所有边中，**权重最小的那条**一定属于某个 MST。

这个性质就是 Prim 和 Kruskal 正确的理论基础：
- Kruskal 从小到大选边，如果它连接了不同的"连通分量"（跨越了切分），就选它
- Prim 每次选跨越"已访问"和"未访问"的最短边

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **最小生成树（MST）** | 包含所有顶点且边权和最小的树 |
| **Kruskal** | 排序选边，并查集检查环——适合稀疏图 |
| **Prim** | 从点出发扩展，每次选到 MST 最近的点——适合稠密图 |
| **切分性质** | MST 的正确性基础——最短的跨切边一定属于某个 MST |
| **并查集** | 快速判断两个顶点是否已连通 |

> 🎯 **思考题**：如果图中的边权有负数，MST 算法会受影响吗？会不会找到的"最小"生成树变成包含负权边更少的树？

**为什么先学这个？** 图算法到此结束。接下来回到基础话题——排序。先复习[[basic-sort|基础排序（插入、选择、冒泡）]]，再学习更高效的[[advanced-sort|高级排序（归并、快排、堆排）]]。
