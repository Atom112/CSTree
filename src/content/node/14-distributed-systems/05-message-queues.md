---
id: message-queues
title: 消息队列（Kafka）
summary: 消息队列（MQ）解耦生产者和消费者——生产者发消息到队列，消费者异步处理。Kafka 是高性能分布式消息系统，用分区和日志实现高吞吐
difficulty: advanced
order: 5
parent: distributed-computing
children:
  - microservices
related: []
prerequisites:
  - distributed-system-models
tags:
  - distributed
  - kafka
  - message-queue
createdAt: 2026-06-12
---

## Kafka 架构

```
Producer → Topic (Partition 0, 1, 2...) → Consumer Group
                          ↓
             每条消息存在日志中（持久化）
             分区内消息有序
             消费者通过偏移量跟踪位置
```

## 应用场景

| 场景 | 说明 |
|:----:|------|
| **日志收集** | 各服务日志 → Kafka → 存储 |
| **事件驱动** | 订单创建→发邮件→更新库存 |
| **流处理** | Kafka Streams 实时计算 |
| **削峰填谷** | 瞬时请求→队列缓慢消费 |

## 小结

| 概念 | 要点 |
|:----:|------|
| **Topic** | 消息分类 |
| **Partition** | 分片实现并行 |
| **Offset** | 消息在分区中的位置 |
| **Consumer Group** | 组内分摊消费分区 |

**为什么先学这个？** 消息队列后，学习[[microservices|微服务架构]]。
