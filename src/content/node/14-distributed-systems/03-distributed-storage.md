---
id: distributed-storage
title: 分布式存储（GFS, HDFS）
summary: 分布式存储把大文件切分成块分布到多台机器——GFS/HDFS 用主节点管理元数据、数据块在多个节点上复制，提供高吞吐和容错
difficulty: advanced
order: 3
parent: consensus-protocols
children:
  - message-queues
related: []
prerequisites:
  - distributed-system-models
tags:
  - distributed
  - storage
  - hdfs
createdAt: 2026-06-12
---

## HDFS 架构

```
NameNode（主）：管理文件系统元数据
  ─ 文件 → 数据块映射
  ─ 数据块 → DataNode 映射

DataNode（从）：存储实际数据块，默认 3 副本
```

## 数据分片与复制

```
文件 1GB → 拆成 64MB 块 → 16 块
每块复制 3 份 → 分布在不同机架上
```

## 小结

| 概念 | 要点 |
|:----:|------|
| **分片** | 大文件切成小块 |
| **复制** | 多副本容错（通常 3） |
| **主节点** | 管理元数据 |
| **机架感知** | 副本分布在不同机架 |

**为什么先学这个？** 存储后，学习[[distributed-computing|分布式计算（MapReduce）]]。
