---
id: search-algorithms
title: 搜索算法（BFS, DFS, A\*）
summary: 搜索算法是 AI 中最基本的问题求解方法——BFS 逐层扩展保证最短路径，DFS 深入探索用栈，A\* 用启发式函数引导方向
difficulty: intermediate
order: 2
parent: ai-overview
children:
  - minimax
related: []
prerequisites:
  - ai-overview
tags:
  - ai
  - search
  - algorithm
createdAt: 2026-06-12
updatedAt: 2026-06-13
---

## 🧭 从"走迷宫"到"规划路线"——搜索的本质

AI 要解决很多"找路"的问题：地图导航找最短路线、下棋时找最佳走法、解谜题时找步骤序列。

**搜索（Search）** 是 AI 最基本的问题求解方法——把问题空间看作一个图，从起始状态出发，寻找通往目标状态的路。

搜索算法的核心权衡：**探索（Exploration）vs 利用（Exploitation）**——更广地搜索可能找到更优解，但更慢；更深地搜索更快，但可能错过最优解。

> 🏪 **类比：找钥匙**
>
> **BFS** = 从丢钥匙的位置开始，一圈一圈往外找——肯定能找到最近的钥匙，但要搜很大范围。
>
> **DFS** = 选一个方向一直找，走到底发现没有退回来换方向——可能很快找到，也可能走很远才发现走错了。
>
> **A\*** = 目测"钥匙最可能在卧室"，优先搜卧室——有方向地找，通常最快。

---

## 🌊 BFS（广度优先搜索）

用队列，逐层扩展——保证找到最短路径（步数最少）。

**适用于**：迷宫最短路径、社交网络"一度人脉"、无权图。

## 🪞 DFS（深度优先搜索）

用栈（或递归），深入到底再回溯。

**适用于**：拓扑排序、环检测、游戏策略搜索。

## ⭐ A\* 搜索——最有"方向感"的搜索

A\* 是**启发式搜索**——不盲目搜索，而是用**估计值**引导方向。

```
f(n) = g(n) + h(n)

g(n) = 从起点到 n 的实际代价（已经走了多远）
h(n) = 从 n 到终点的估计代价（还有多远）——启发式函数
f(n) = 经过 n 的路径的总估计代价

每次选 f(n) 最小的节点扩展——A* 总是优先探索"最有希望"的方向
```

```python
import heapq

def a_star(start, goal, h_func, get_neighbors):
    """A* 搜索算法"""
    open_set = [(0 + h_func(start, goal), 0, start, [start])]
    visited = {start: 0}  # 节点 → 最小 g 值
    
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        
        if current == goal:
            return path
        
        for next_node, cost in get_neighbors(current):
            new_g = g + cost
            if next_node not in visited or new_g < visited[next_node]:
                visited[next_node] = new_g
                new_f = new_g + h_func(next_node, goal)
                heapq.heappush(open_set, (new_f, new_g, next_node, path + [next_node]))
    
    return None  # 无解

# 例子：用曼哈顿距离作为启发式函数
def manhattan(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])
```

**A\* 最优的条件**：如果启发式函数 `h(n)` 是**可采纳的**（不会高估到终点的距离）——A\* 保证找到最短路径。

---

## 📝 小结

| 算法 | 数据结构 | 方向感？ | 保证最短路径？ |
|:----:|:--------:|:--------:|:-------------:|
| **BFS** | 队列 | ❌ 盲目 | ✅ |
| **DFS** | 栈 | ❌ 盲目 | ❌ |
| **A\*** | 优先队列 | ✅ 启发式 | ✅（如果 h 可采纳）|

**为什么先学这个？** 搜索是 AI 的基础方法。搜索的思想延伸到博弈——[[minimax|博弈与对抗搜索（Minimax）]]。
