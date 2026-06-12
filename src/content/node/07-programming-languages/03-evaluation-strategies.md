---
id: evaluation-strategies
title: 求值策略（传值、传引用、惰性求值）
summary: 求值策略决定函数调用时参数的计算方式——传值（值拷贝）、传引用（地址）、传共享（对象引用）、惰性求值（需要时才算）
difficulty: intermediate
order: 3
parent: variable-scope
children:
  - lambda-calculus
  - garbage-collection
related: []
prerequisites:
  - variable-scope
tags:
  - pl
  - evaluation
createdAt: 2026-06-12
---

## 传值 vs 传引用

```python
def foo(x):
    x = 10       # 传值：修改不影响调用方

def bar(lst):
    lst.append(4) # 传共享：对象内容可以改

a = 5
foo(a)  # a 还是 5

b = [1, 2, 3]
bar(b)  # b 变成 [1, 2, 3, 4]
```

## 惰性求值

Haskell 默认惰性——表达式在需要结果时才计算：

```haskell
-- 不会死循环！因为 take 3 只需要前 3 个元素
take 3 [1..]  -- 无限列表，结果：[1, 2, 3]
```

## 小结

| 策略 | 行为 |
|:----:|------|
| **传值** | 拷贝值，不修改原变量 |
| **传引用** | 传递地址，可修改原变量 |
| **传共享** | 传对象引用（Python、Java） |
| **惰性求值** | 需要时才计算 |

**为什么先学这个？** 了解求值后，学习[[lambda-calculus|Lambda 演算基础]]。
