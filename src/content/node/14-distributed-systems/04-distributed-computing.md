---
id: distributed-computing
title: 分布式计算（MapReduce）
summary: MapReduce 是 Google 提出的分布式编程模型——Map 阶段分片处理，Reduce 阶段汇总结果。自动处理并行化和容错
difficulty: advanced
order: 4
parent: distributed-storage
children: []
related: []
prerequisites:
  - distributed-storage
tags:
  - distributed
  - mapreduce
  - big-data
createdAt: 2026-06-12
---

## MapReduce 流程

```
输入 → 分片 → Map（并行处理每个分片）→ Shuffle（排序+分组）→ Reduce（合并结果）→ 输出
```

## 词频统计示例

```python
def map(filename, content):
    for word in content.split():
        emit(word, 1)

def reduce(word, counts):
    emit(word, sum(counts))

# 输入：大量文档
# 输出：每个单词出现的总次数
```

## 小结

| 阶段 | 操作 | 并行度 |
|:----:|:----:|:------:|
| **Map** | 分片处理 | 每分片一个任务 |
| **Shuffle** | 排序+分组 | 自动 |
| **Reduce** | 汇总 | 每分区一个任务 |

**为什么先学这个？** 计算后，学习[[message-queues|消息队列（Kafka）]]。
