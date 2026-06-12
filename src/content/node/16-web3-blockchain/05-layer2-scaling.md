---
id: layer2-scaling
title: Layer2 与扩容方案
summary: L1（以太坊主链）每秒只能处理约 15 笔交易——太慢了。Layer2 把大量交易在链下处理，只把结果提交到主链。Rollup 是当前最主流的 L2 方案
difficulty: advanced
order: 5
parent: dapp
children: []
related: []
prerequisites:
  - pow-consensus
tags:
  - blockchain
  - layer2
  - rollup
createdAt: 2026-06-12
---

## Rollup

```
交易在链下执行 → 压缩后提交到 L1
Optimistic Rollup：假设交易有效，7 天挑战期（Arbitrum, OP）
ZK Rollup：用零知识证明验证，即时确认（zkSync, StarkNet）
```

## 其他方案

| 方案 | 原理 | 代表 |
|:----:|:----:|:----:|
| **状态通道** | 链下双向通道 | Lightning Network |
| **侧链** | 独立链，桥接主链 | Polygon |
| **Plasma** | 子链树 | 已基本被 Rollup 取代 |

## 小结

| 方案 | 安全模型 | 吞吐量 |
|:----:|:--------:|:------:|
| **OP Rollup** | 欺诈证明 | 2000+ TPS |
| **ZK Rollup** | 零知识证明 | 3000+ TPS |
| **状态通道** | 多方签名 | 百万级 |

**为什么先学这个？** 区块链板块完。进入形式化方法板块。
