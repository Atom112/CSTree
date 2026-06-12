---
id: consensus-protocols
title: 一致性协议（Paxos, Raft）
summary: 一致性协议让分布式系统中的节点对某个值达成共识——Paxos 是理论基础但难理解，Raft 通过强领导者简化了共识过程，是 etcd/Consul 的核心
difficulty: advanced
order: 2
parent: distributed-system-models
children:
  - distributed-storage
  - distributed-computing
related: []
prerequisites:
  - distributed-system-models
tags:
  - distributed
  - consensus
  - raft
createdAt: 2026-06-12
---

## Raft

Raft 把共识分解为三个子问题：

```
1. 领导者选举：节点投票选出一个领导者
2. 日志复制：领导者把日志复制到所有节点
3. 安全性：如果多数节点存了日志，它就是已提交的
```

## 角色

| 角色 | 职责 |
|:----:|------|
| **领导者（Leader）** | 处理客户端请求，管理日志复制 |
| **候选者（Candidate）** | 发起选举 |
| **跟随者（Follower）** | 被动接受领导者指令 |

## 小结

| 协议 | 核心 | 应用 |
|:----:|:----:|:----:|
| **Paxos** | 无领导者共识 | 理论基石 |
| **Raft** | 强领导者 | etcd, Consul |
| **Zab** | 类 Raft | ZooKeeper |

**为什么先学这个？** 共识协议后，学习[[distributed-storage|分布式存储（GFS, HDFS）]]。
