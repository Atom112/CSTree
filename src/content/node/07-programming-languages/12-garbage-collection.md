---
id: garbage-collection
title: 垃圾回收机制
summary: 垃圾回收（Garbage Collection, GC）自动回收不再使用的内存——程序员不用手动 free/delete。标记-清除、复制、分代回收是三种主要算法
difficulty: advanced
order: 12
parent: evaluation-strategies
children:
  - concurrency-models
related: []
prerequisites:
  - evaluation-strategies
tags:
  - pl
  - gc
  - memory
createdAt: 2026-06-12
---

## GC 算法

| 算法 | 原理 | 特点 |
|:----:|------|------|
| **标记-清除** | 从根对象出发标记所有可达对象，清除不可达的 | 有碎片 |
| **复制** | 将活动对象复制到新空间，原空间全部释放 | 无碎片，空间减半 |
| **分代回收** | 对象分代，年轻代频繁回收，老年代少回收 | 效率高 |

## Go 的三色标记法

```
白色：未访问的对象
灰色：已访问但子对象未访问
黑色：已访问且子对象已访问

并发标记：程序执行与 GC 同时进行
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **GC** | 自动回收不可达内存 |
| **分代** | 大多数对象很快死亡，分代提升效率 |
| **STW** | Stop The World——GC 时的暂停 |

**为什么先学这个？** GC 是实现细节。看看[[concurrency-models|并发编程模型（Actor, CSP）]]。
