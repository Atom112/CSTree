---
id: variable-scope
title: 变量、作用域与绑定
summary: 作用域（Scope）决定变量在哪些区域可见——静态作用域看代码结构，动态作用域看调用链。绑定（Binding）是把名字和实体关联起来的过程
difficulty: intermediate
order: 2
parent: programming-paradigms
children:
  - evaluation-strategies
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - scope
  - binding
createdAt: 2026-06-12
---

## 静态作用域 vs 动态作用域

```python
x = 1
def outer():
    x = 2
    def inner():
        print(x)  # 静态作用域：2（看定义位置）
    inner()
```

```
静态作用域（词法作用域）：看函数定义时所在的作用域
动态作用域：看函数调用时所在的作用域（如 Bash、Emacs Lisp）
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **作用域** | 变量可见的范围 |
| **静态作用域** | 编译时确定，最常见 |
| **动态作用域** | 运行时确定，少数语言使用 |

**为什么先学这个？** 理解作用域后，学习[[evaluation-strategies|求值策略（传值、传引用、惰性求值）]]。
