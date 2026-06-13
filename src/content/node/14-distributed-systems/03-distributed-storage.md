---
id: distributed-storage
title: 分布式存储（GFS, HDFS）
summary: 分布式存储把数据分散到多台机器——分片（Sharding）分散数据，复制（Replication）保证可用。GFS/HDFS 是分布式文件系统的代表，用主节点管理元数据
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
updatedAt: 2026-06-13
---

## 💾 数据量大到一台机器存不下了

1TB 的硬盘——看起来很大。但 YouTube 每分钟上传 500 小时视频——一天的数据量就是几个 PB（1PB = 1024TB）。

**分布式存储**的思路：把数据**分片（Shard）** 存到多台机器上，同时**复制副本**防止机器故障丢数据。

> 🏪 **类比：图书馆搬迁"
>
> 一个图书馆有 100 万本书——一个房间放不下。
>
> **分片** = 把书按字母拆到 10 个房间：A-F 放 1 号房、G-L 放 2 号房……
>
> **复制** = 每个房间的书在另一个房间备份一份——1 号房火灾了，备份房还有。
>
> **挑战**：你(客户端)怎么知道我要找的书在哪个房间？（元数据管理）

---

## 🏛️ GFS/HDFS 架构

Google 文件系统（GFS）和其开源实现 Hadoop HDFS 是分布式存储的经典架构。

```
客户端
  │
  ▼
┌──────────────┐        ┌──────────────────────────────┐
│  Master节点    │←──→   │  Chunk Server（数据节点）       │
│  （一个）       │        │  ├── Chunk 1（副本）           │
│  存元数据      │        │  ├── Chunk 5（主副本）         │
│  文件名→Chunk │        │  └── Chunk 8（副本）           │
└──────────────┘        ├──────────────────────────────┤
                         │  Chunk Server（数据节点）       │
                         │  ├── Chunk 2（主副本）         │
   客户端读文件流程：     │  ├── Chunk 1（副本）           │
   1. 问 Master "我要读 X"│  └── ...                     │
   2. Master 返回 Chunk 列表└──────────────────────────────┘
   3. 直接从 Chunk Server 读数据
   （Master 只存元数据——不存实际数据）
```

### HDFS 的关键设计

| 概念 | 说明 | 为什么 |
|:----:|:----:|:-------|
| **块（Block）** | 默认 128MB（远大于磁盘的 4KB）| 减少寻道时间——适合大文件顺序读 |
| **副本（Replica）** | 默认 3 副本 | 容错——两台机器挂了数据也不丢 |
| **Master/Slave** | 一个主节点管理元数据 | 简化设计 |
| **一次写入多次读** | 不支持随机修改 | 针对大数据分析优化 |

### HDFS 读文件

```bash
# HDFS 命令——和 Linux 命令风格一致
hdfs dfs -ls /data        # 查看文件列表
hdfs dfs -put file.txt /data/  # 上传文件（自动分片+复制）
hdfs dfs -get /data/file.txt   # 下载文件
hdfs dfs -cat /data/file.txt   # 查看内容
```

---

## 📝 小结

| 概念 | 一句话 |
|:----:|--------|
| **分片（Sharding）** | 数据分散到多台机器——解决单机容量问题 |
| **复制（Replication）** | 数据存多份——机器故障不丢数据 |
| **HDFS** | Hadoop 分布式文件系统——128MB 块、3 副本 |
| **Master 节点** | 存元数据——知道"文件存在哪些节点上" |

**为什么先学这个？** 大数据存在 HDFS 里，接下来怎么处理它？——[[distributed-computing|分布式计算（MapReduce）]]。
