---
id: stack-queue
title: 栈与队列
summary: 栈（Stack）是后进先出（LIFO），队列（Queue）是先进先出（FIFO）——它们是两种最基础的操作受限线性表
difficulty: beginner
order: 2
parent: array-linked-list
children:
  - hash-table
  - recursion-divide-conquer
related: []
prerequisites:
  - array-linked-list
tags:
  - algorithm
  - stack
  - queue
createdAt: 2026-06-12
---

## 栈——后进先出

```python
stack = []
stack.append(1)    # 入栈 push
stack.append(2)
stack.append(3)
stack.pop()        # 出栈 pop → 3
stack.pop()        # → 2
```

> 🏫 **类比：一叠盘子**——你总是拿最上面的（后放的），放也放最上面。

## 队列——先进先出

```python
from collections import deque
queue = deque()
queue.append(1)     # 入队
queue.append(2)
queue.popleft()     # 出队 → 1
queue.popleft()     # → 2
```

> 🏫 **类比：排队**——先到的人先被服务。

## 小结

| 结构 | 原则 | 应用 |
|:----:|:----:|------|
| **栈** | LIFO | 函数调用、括号匹配、撤销操作 |
| **队列** | FIFO | BFS、任务队列、消息队列 |

**为什么先学这个？** 栈和队列是许多算法的基础。接下来看看[[hash-table|哈希表]]。
