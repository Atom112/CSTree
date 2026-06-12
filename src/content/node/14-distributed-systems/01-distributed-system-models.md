---
id: distributed-system-models
title: 分布式系统模型与 CAP 定理
summary: 分布式系统是多个节点通过网络协作完成共同任务——CAP 定理说一致性、可用性、分区容错性三者最多选两个。FLP 不可能性证明异步系统中无法达成共识
difficulty: advanced
order: 1
parent:
children:
  - consensus-protocols
related: []
prerequisites: []
tags:
  - distributed
  - cap
  - theory
createdAt: 2026-06-12
---

## CAP 定理

```
一致性 (C)：所有节点同一时刻看到相同数据
可用性 (A)：每个请求都能收到响应
分区容错 (P)：节点间通信中断时系统仍能工作

三者不可兼得：
CP：牺牲可用性（ZooKeeper, etcd）
AP：牺牲一致性（Cassandra, DynamoDB）
CA：不分区时（实际上不存在）
```

## FLP 不可能性

在异步通信模型中，即使只有一个节点可能故障，也无法保证在有限时间内达成共识。

## 小结

| 概念 | 要点 |
|:----:|------|
| **CAP** | C、A、P 最多选两个 |
| **FLP** | 异步共识不可保证 |
| **BASE** | Basically Available, Soft state, Eventually consistent |

**为什么先学这个？** 了解理论后，学习[[consensus-protocols|一致性协议（Paxos, Raft）]]。
