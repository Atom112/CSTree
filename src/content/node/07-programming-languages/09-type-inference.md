---
id: type-inference
title: 类型推导与多态
summary: 类型推导（Type Inference）让编译器自动推断类型——你不用写 `int x = 1` 中的 int。参数多态（泛型）让函数对不同类型都适用
difficulty: advanced
order: 9
parent: static-vs-dynamic
children: []
related: []
prerequisites:
  - static-vs-dynamic
tags:
  - pl
  - type-inference
  - polymorphism
createdAt: 2026-06-12
---

## 类型推导

```haskell
-- Haskell 自动推导类型
add x y = x + y
-- 推导出：add :: Num a => a -> a -> a

map f [] = []
map f (x:xs) = f x : map f xs
-- 推导出：map :: (a -> b) -> [a] -> [b]
```

## 参数多态（泛型）

```java
// Java 泛型——对任意类型 T 适用
class Box<T> {
    private T value;
    public void set(T v) { this.value = v; }
    public T get() { return value; }
}

Box<Integer> intBox = new Box<>();
Box<String> strBox = new Box<>();
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **类型推导** | 自动推断表达式类型 |
| **参数多态** | 泛型，不同类型共享同一实现 |
| **Hindley-Milner** | 经典的类型推导算法 |

**为什么先学这个？** 类型推导是 PL 理论的核心。下一节[[subtyping|子类型与变型（协变/逆变）]]。
