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
updatedAt: 2026-06-13
---

## 🗺️ 两种找路的方式——走迷宫和波浪扩散

想象你在一个陌生的小镇里找一个特定的咖啡馆。你有两种策略：

**策略一（DFS 式）：** 你选了一条路一直走，走到死胡同就退回到上一个岔路口，换一条路接着走。一条路走到底，走不通再回头。

**策略二（BFS 式）：** 你以当前位置为圆心，先找步行 1 分钟内能到的店，没有的话再找步行 2 分钟内能到的店……一圈一圈地扩大搜索范围。

> 🧩 **两种策略的经典类比**
>
> **DFS = 走迷宫**：一直往前走，走到死胡同就退回上一个岔路口重新选路。你用的是"栈"（或者递归）——你走过的路就是栈，退回到上一个岔路口就是出栈。
>
> **BFS = 石子投入水中**：石子落入平静的水面，波纹一圈一圈向外扩散。每个时刻，波纹上的每个点都在同时向外扩展。你用的是一个"队列"——先到达的波纹不会被阻塞，而是继续向前推进。
>
> 这两种搜索策略是图的"遍历算法"中最基本的两种。几乎所有图算法（最短路径、连通性检测、拓扑排序）都以它们为基础。

---

## 🌊 BFS（广度优先搜索）——队列、逐层

### 算法思想

BFS 从起点出发，**一层一层地"扩散"**：先访问和起点距离为 1 的所有顶点，再访问距离为 2 的，再访问距离为 3 的……

### 代码实现

```python
from collections import deque

def bfs(graph, start):
    visited = {start}               # 记录已访问的顶点
    queue = deque([start])          # 队列：存"待访问"的顶点
    traverse_order = []              # 遍历顺序
    
    while queue:
        v = queue.popleft()         # 出队队首
        traverse_order.append(v)
        
        for neighbor in graph[v]:   # 遍历所有邻居
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)  # 未访问的邻居入队
    
    return traverse_order
```

### 过程演示

```
图：
    A ── B ── C
    |         |
    D ── E ── F

从 B 开始 BFS：
queue = [B]
出队 B → 访问 B，邻居 A, C 入队
queue = [A, C]
出队 A → 访问 A，邻居 D 入队（B 已访问）
queue = [C, D]
出队 C → 访问 C，邻居 F 入队（B 已访问）
queue = [D, F]
出队 D → 访问 D，邻居 E 入队（A 已访问）
queue = [F, E]
出队 F → 访问 F（无新邻居）
queue = [E]
出队 E → 访问 E（无新邻居）

遍历顺序：B, A, C, D, F, E
```

### BFS 的应用

#### ① 最短路径（无权图）

BFS 最大的特点：**第一次访问到目标节点时，走的就是最短路径**（边数最少）。

```python
def bfs_shortest_path(graph, start, target):
    visited = {start}
    queue = deque([(start, [start])])  # (顶点, 从start到该顶点的路径)
    
    while queue:
        v, path = queue.popleft()
        if v == target:
            return path  # 第一次找到target时的路径就是最短的
        
        for neighbor in graph[v]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return None  # 没有路径

# 在上面的图中找 B→F 的最短路径
print(bfs_shortest_path(graph, 'B', 'F'))
# → ['B', 'C', 'F']（3 步，不是 B→A→D→E→F 的 5 步）
```

#### ② 判断图的连通性

```python
def is_connected(graph):
    start = next(iter(graph))  # 取一个顶点
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        v = queue.popleft()
        for neighbor in graph[v]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return len(visited) == len(graph)  # 是否访问了所有顶点
```

#### ③ 二叉树的层序遍历

```python
def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # 当前层的节点数
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)  # 每层的结果单独成列表
    
    return result
# 输出：[[1], [2, 3], [4, 5, 6]]
```

---

## 🪞 DFS（深度优先搜索）——栈/递归、深入

### 算法思想

DFS 从起点出发，**一条路走到黑**——尽可能深地探索，实在走不通了再回头。回头后选择另一个方向继续深入。

### 代码实现

```python
# 递归版本（最简洁）
def dfs_recursive(graph, v, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(v)
    print(v, end=' ')  # 访问顶点
    
    for neighbor in graph[v]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
```

```python
# 迭代版本（用栈模拟递归）
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    
    while stack:
        v = stack.pop()
        if v not in visited:
            visited.add(v)
            print(v, end=' ')
            # 注意：为了和递归顺序一致，把邻居逆序入栈
            for neighbor in reversed(graph[v]):
                if neighbor not in visited:
                    stack.append(neighbor)
```

### 过程演示

```
同样的图，从 B 开始 DFS：

stack = [B]
出栈 B → 访问 B，A, C 入栈
stack = [A, C]（B 已出栈）
出栈 C → 访问 C，F 入栈（B 已访问）
stack = [A, F]
出栈 F → 访问 F
stack = [A]
出栈 A → 访问 A，D 入栈（B 已访问）
stack = [D]
出栈 D → 访问 D，E 入栈（A 已访问）
stack = [E]
出栈 E → 访问 E

遍历顺序：B, C, F, A, D, E
（注意和 BFS 的顺序不同）
```

### DFS 的应用

#### ① 拓扑排序（Topological Sorting）

对有向无环图（DAG），拓扑排序输出顶点的一个线性排列——每个顶点都在它的所有后继之前。

```python
def topological_sort(graph):
    visited = set()
    result = []  # 用列表模拟栈
    
    def dfs(v):
        visited.add(v)
        for neighbor in graph[v]:
            if neighbor not in visited:
                dfs(neighbor)
        result.append(v)  # 后序遍历——在退出时加入结果
    
    for v in graph:
        if v not in visited:
            dfs(v)
    
    return list(reversed(result))  # 反转得到拓扑序

# 例子：课程依赖关系
# "数据结构" → "算法"（先上数据结构才能上算法）
courses = {
    '数据结构': ['算法', '数据库'],
    '算法': ['机器学习'],
    '数据库': [],
    '机器学习': [],
    '操作系统': ['计算机网络'],
    '计算机网络': [],
}
print(topological_sort(courses))
# 可能结果：['数据结构', '数据库', '算法', '机器学习', '操作系统', '计算机网络']
```

#### ② 检测环

DFS 可以检测图中是否有环（有向图或无向图）。

```python
def has_cycle(graph):
    visited = set()
    rec_stack = set()  # 当前递归栈中的顶点
    
    def dfs(v):
        visited.add(v)
        rec_stack.add(v)
        
        for neighbor in graph[v]:
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True  # 发现后向边 → 有环
        
        rec_stack.remove(v)
        return False
    
    for v in graph:
        if v not in visited:
            if dfs(v):
                return True
    return False
```

---

## ⚔️ BFS vs DFS——全面对比

| 维度 | BFS | DFS |
|:----:|:----:|:----:|
| **数据结构** | 队列 | 栈（或递归）|
| **空间复杂度** | O(宽度) —— 可能很大 | O(深度) —— 通常更小 |
| **最短路径** | ✅ 一定能找到（无权图）| ❌ 不能保证 |
| **是否找到解** | 如果有，一定能找到（完备）| 可能无限循环（无深度限制时）|
| **拓扑排序** | ❌ 不适合 | ✅ 天然适合 |
| **检测环** | ✅ 可以 | ✅ 可以 |
| **连通性** | ✅ 可以 | ✅ 可以 |

### 什么时候用 BFS？

- 需要**最短路径**（无权图）
- 树的**层序遍历**
- 解在"浅层"时（离起点不远）
- 图比较宽、深度较浅

### 什么时候用 DFS？

- 需要**拓扑排序**
- 需要**检测环**
- 在"深层"找解（如解谜题、N 皇后）
- 内存受限、图非常宽（BFS 队列太大）
- 图的连通分量、强连通分量

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **BFS** | 队列、逐层扩散——像石子入水波纹扩散 |
| **DFS** | 栈/递归、深入到底再回溯——像走迷宫 |
| **BFS 的应用** | 无权图最短路径、层序遍历、连通性 |
| **DFS 的应用** | 拓扑排序、环检测、连通分量 |
| **visited** | 防重复访问的关键（否则会死循环）|
| **空间** | BFS 看宽度，DFS 看深度 |

> 🎯 **思考题**：在"扫雷"游戏中，当你点击一个空格时，游戏会展开一片相邻的空格——这个逻辑是用 BFS 还是 DFS 实现的？还是两者都可以？

**为什么先学这个？** BFS 和 DFS 是图算法的"基本功"——几乎所有高级图算法都基于它们。接下来学习两个最重要的图算法：[[shortest-path|最短路径（Dijkstra, Floyd）]]和[[minimum-spanning-tree|最小生成树（Kruskal, Prim）]]。
