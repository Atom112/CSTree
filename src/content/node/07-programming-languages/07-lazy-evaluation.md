---
id: lazy-evaluation
title: 惰性求值与无穷数据结构
summary: 惰性求值（Lazy Evaluation）让表达式在需要时才计算——这让"无穷"数据结构成为可能，也避免了不必要的计算
difficulty: advanced
order: 7
parent: algebraic-data-types
children: []
related:
  - evaluation-strategies
prerequisites:
  - algebraic-data-types
tags:
  - pl
  - lazy
  - functional
createdAt: 2026-06-12
---

## 惰性求值的好处

```haskell
-- Haskell 默认惰性
-- take 3 只需要前 3 个，不会计算整个无限列表
take 3 [1..]       -- [1, 2, 3]

-- 无穷斐波那契数列
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
take 10 fibs       -- [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **惰性求值** | 需要时才计算 |
| **无穷结构** | 按需生成元素，可表示无穷序列 |
| **性能** | 避免不需要的计算，但引入 thunk 开销 |

**为什么先学这个？** 惰性求值与[[evaluation-strategies|求值策略]]密切相关。继续学习[[static-vs-dynamic|静态 vs 动态类型]]。
