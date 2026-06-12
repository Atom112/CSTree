---
id: concurrency-models
title: 并发编程模型（Actor, CSP）
summary: 并发模型解决了"多个执行流怎么协作"的问题——Actor 模型通过消息传递（Erlang、Akka），CSP 通过通道（Go、Clojure），共享内存通过锁（Java、C++）
difficulty: advanced
order: 13
parent: garbage-collection
children: []
related:
  - mutex-semaphore
prerequisites:
  - garbage-collection
tags:
  - pl
  - concurrency
  - actor
  - csp
createdAt: 2026-06-12
---

## 三种并发模型

| 模型 | 核心思想 | 代表 |
|:----:|---------|------|
| **共享内存+锁** | 多线程共享变量，用锁互斥 | C++, Java |
| **Actor 模型** | 万物皆 Actor，Actor 之间发消息 | Erlang, Akka |
| **CSP** | 进程通过通道通信 | Go, Clojure |

## 通俗对比

```
共享内存：一群人共用一块白板——每个人要写字得先抢到笔（锁），容易吵架（死锁）
Actor：  每个人有自己的小本本——只能给别人传纸条，不能直接改别人的本子
CSP：    每个人有一根管子连到别人——通过管子（channel）传东西，两边不能直接接触
```

## 小结

| 模型 | 优点 | 缺点 |
|:----:|:----:|:----:|
| **共享内存** | 直接、高效 | 死锁、竞争条件 |
| **Actor** | 分布式友好、无竞争条件 | 消息过载 |
| **CSP** | 通道清晰、goroutine 轻量 | 通道设计有挑战 |

**为什么先学这个？** PL 板块最后一节——[[domain-specific-languages|领域特定语言（DSL）]]。
