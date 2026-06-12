---
id: static-vs-dynamic
title: 静态 vs 动态类型
summary: 静态类型在编译时检查类型，动态类型在运行时检查——静态类型更安全但编写时约束多，动态类型更灵活但运行时可能暴露错误
difficulty: intermediate
order: 8
parent: programming-paradigms
children:
  - type-inference
related: []
prerequisites:
  - programming-paradigms
tags:
  - pl
  - type-system
createdAt: 2026-06-12
---

## 静态 vs 动态

```python
# Python（动态类型）——运行时才报错
def add(a, b):
    return a + b
add(1, 2)      # 3
add("hello", " world")  # "hello world"
add(1, "hello")  # 运行时 TypeError！
```

```java
// Java（静态类型）——编译时就检查
int add(int a, int b) { return a + b; }
add(1, 2);        // ✅
add(1, "hello");  // ❌ 编译错误
```

## 小结

| 对比 | 静态类型 | 动态类型 |
|:----:|:--------:|:--------:|
| 检查时机 | 编译时 | 运行时 |
| 安全性 | 更安全 | 更灵活 |
| 速度 | 更高效 | 更慢 |
| 代码密度 | 需要类型标注 | 更简洁 |

**为什么先学这个？** 静态类型系统可以[[type-inference|类型推导与多态]]。
