---
id: higher-order-functions
title: 高阶函数与闭包
summary: 高阶函数是把函数当成"一等公民"——函数可以作为参数传递、作为返回值返回。闭包（Closure）是函数 + 捕获的环境
difficulty: intermediate
order: 4
parent: programming-paradigms
children:
  - algebraic-data-types
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - functional
  - closure
createdAt: 2026-06-12
---

## 高阶函数

```python
# 函数作为参数
def apply_twice(f, x):
    return f(f(x))

def inc(n): return n + 1
print(apply_twice(inc, 5))  # 5→6→7

# map/filter/reduce
list(map(lambda x: x*2, [1, 2, 3]))  # [2, 4, 6]
```

## 闭包

```python
def make_counter():
    count = 0
    def counter():        # 闭包：captures 'count'
        nonlocal count
        count += 1
        return count
    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **高阶函数** | 函数作为参数或返回值 |
| **闭包** | 函数+捕获的外部变量 |
| **好处** | 更简洁、可组合的代码 |

**为什么先学这个？** 函数式编程的基础。继续学习[[algebraic-data-types|代数数据类型与模式匹配]]。
