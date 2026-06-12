---
id: pow-consensus
title: 工作量证明与共识
summary: 工作量证明（PoW）让矿工通过计算哈希找到有效 Nonce——最先找到的矿工有权出块并获得奖励。PoS 用质押代币代替计算，更节能
difficulty: advanced
order: 2
parent: blockchain-data-structure
children:
  - smart-contracts
related: []
prerequisites:
  - blockchain-data-structure
tags:
  - blockchain
  - pow
  - pos
createdAt: 2026-06-12
---

## PoW——工作量证明

```
矿工不断尝试 Nonce：
hash(区块头 + Nonce) < 目标值

找到 → 获得出块权 + 区块奖励
难度每 2016 个块调整，保持平均 10 分钟出一个块
```

## PoS——权益证明

```
验证者质押代币
随机选择验证者出块（概率与质押量成正比）
恶意行为 → 质押被罚没（Slashing）

以太坊 2022 年从 PoW 切换到 PoS，能耗降低 99.9%
```

## 小结

| 共识 | 安全保证 | 能耗 | 代表 |
|:----:|:--------:|:----:|:----:|
| **PoW** | 算力 | 极高 | Bitcoin |
| **PoS** | 经济权益 | 低 | Ethereum 2.0 |
| **PBFT** | 拜占庭容错 | 低 | Hyperledger |

**为什么先学这个？** 共识后，学习[[smart-contracts|智能合约]]。
