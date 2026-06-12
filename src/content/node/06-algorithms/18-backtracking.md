---
id: backtracking
title: 回溯与剪枝
summary: 回溯（Backtracking）是暴力搜索的"剪枝"版本——尝试所有可能，发现此路不通就退回上一步。剪枝越早，效率越高
difficulty: advanced
order: 18
parent: recursion-divide-conquer
children: []
related: []
prerequisites:
  - recursion-divide-conquer
tags:
  - algorithm
  - backtracking
createdAt: 2026-06-12
---

## N 皇后问题

```python
def solve_n_queens(n):
    result = []
    cols, diag1, diag2 = set(), set(), set()
    
    def backtrack(row, board):
        if row == n:
            result.append(board[:])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue  # 剪枝
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            board.append(col)
            backtrack(row+1, board)
            board.pop()  # 回溯
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)
    
    backtrack(0, [])
    return result
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **回溯** | 尝试→递归→撤销 |
| **剪枝** | 提前排除不可能的分支 |
| **应用** | 排列组合、数独、N 皇后、图着色 |

**为什么先学这个？** 理解算法效率后，学习[[big-o-notation|时间复杂度与大 O]]。
