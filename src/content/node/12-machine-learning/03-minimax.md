---
id: minimax
title: 博弈与对抗搜索（Minimax）
summary: Minimax 算法在零和博弈中搜索最优策略——一方最大化得分，另一方最小化。Alpha-Beta 剪枝大幅减少搜索空间
difficulty: advanced
order: 3
parent: search-algorithms
children: []
related: []
prerequisites:
  - search-algorithms
tags:
  - ai
  - game
  - minimax
createdAt: 2026-06-12
---

## Minimax

```
两个玩家轮流：
MAX 选对自己最有利的走法
MIN 选对 MAX 最不利的走法

递归评估到终局，回溯选择
```

## Alpha-Beta 剪枝

维护两个值：
- α：MAX 能保证的最小得分
- β：MIN 能保证的最大得分

当 α ≥ β 时，剪枝——不需要继续搜索该分支。

## 小结

| 概念 | 要点 |
|:----:|------|
| **Minimax** | 对抗搜索的基础算法 |
| **Alpha-Beta** | 剪枝减少搜索量 |
| **应用** | 围棋、国际象棋、五子棋 AI |

**为什么先学这个？** 博弈后，进入机器学习——[[linear-regression|线性回归与逻辑回归]]。
