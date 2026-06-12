---
id: search-algorithms
title: 搜索算法（BFS, DFS, A\*）
summary: 搜索算法在状态空间中寻找目标——BFS/DFS 是无信息搜索，A\* 用启发函数评估"离目标还有多远"，是路径规划的标准算法
difficulty: intermediate
order: 2
parent: ai-overview
children:
  - minimax
related:
  - dfs-bfs
prerequisites:
  - ai-overview
tags:
  - ai
  - search
  - astar
createdAt: 2026-06-12
---

## A\* 算法

```
f(n) = g(n) + h(n)
g(n) = 从起点到 n 的实际代价
h(n) = 从 n 到目标的估计代价（启发函数）

A* 每次选 f(n) 最小的节点扩展
如果 h(n) ≤ 真实代价 → A* 保证找到最优解
```

## 对比

| 算法 | 信息 | 最优性 | 特点 |
|:----:|:----:|:------:|:----:|
| **BFS** | 无 | ✅（等权图） | 逐层扩展 |
| **DFS** | 无 | ❌ | 深度优先 |
| **A\*** | 有 | ✅ | 启发式搜索 |

**为什么先学这个？** 搜索后，学习[[minimax|博弈与对抗搜索（Minimax）]]。
