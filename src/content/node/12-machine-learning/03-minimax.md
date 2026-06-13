---
id: minimax
title: 博弈与对抗搜索（Minimax）
summary: Minimax 是双人博弈的搜索算法——在对手也最优的前提下最大化自己的收益。Alpha-Beta 剪枝大幅减少搜索量
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
updatedAt: 2026-06-13
---

## ♟️ 下棋——你怎么知道我下一步会走哪？

你和朋友下五子棋。你在想"我走这里"——但你又想"如果我走这里，他会走那里，然后我就可以……"

这就是 Minimax 的思想：**假设对手也是理性的（他会选对他最有利的走法）——你在对手最优的前提下，选对自己最有利的走法**。

```python
def minimax(state, depth, is_maximizing):
    if depth == 0 or game_over(state):
        return evaluate(state)  # 局面评估
    
    if is_maximizing:  # 自己的回合——取最大值
        best = -infinity
        for move in get_moves(state):
            value = minimax(make_move(state, move), depth-1, False)
            best = max(best, value)
        return best
    else:  # 对手的回合——取最小值
        best = infinity
        for move in get_moves(state):
            value = minimax(make_move(state, move), depth-1, True)
            best = min(best, value)
        return best
```

### Alpha-Beta 剪枝——不用搜所有可能性

Minimax 的搜索树随深度指数增长——象棋的全部分支 ≈ 10¹²⁰。不可能搜完。

Alpha-Beta 剪枝：**如果一个分支已经不可能比已知的最优解更好——直接剪掉**。

```python
def alpha_beta(state, depth, alpha, beta, is_maximizing):
    """alpha = 当前已知的最优下界，beta = 最优上界"""
    if depth == 0 or game_over(state):
        return evaluate(state)
    
    if is_maximizing:
        value = -infinity
        for move in get_moves(state):
            value = max(value, alpha_beta(state, depth-1, alpha, beta, False))
            alpha = max(alpha, value)
            if alpha >= beta:  # 剪枝！对手不会允许这个分支
                break
        return value
    else:
        # 类似——取最小值，剪枝条件是 beta <= alpha
```

Alpha-Beta 剪枝可以把搜索量从 O(b^d) 降到约 O(b^(d/2))——同样的时间内可以搜索两倍的深度。

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **Minimax** | 假设对手最优——我取最大，对手取最小 |
| **Alpha-Beta 剪枝** | 不可能比已知解更好的分支直接剪掉 |
| **评估函数** | 无法搜到底时——用启发式评估局面好坏 |

**为什么先学这个？** 搜索和博弈是经典 AI。但现代 AI 的核心是从数据中学习——[[linear-regression|线性回归与逻辑回归]]。
